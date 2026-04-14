const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { pool } = require('../config/db');

// HELPER: GENERATE ACCESS TOKEN
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// HELPER: GENERATE REFRESH TOKEN
function generateRefreshToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

// HELPER: HASH PASSWORD
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// HELPER: COMPARE PASSWORD
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// HELPER: GET USER ROLES
async function getUserRoles(userId) {
  const result = await pool.query(
    `SELECT r.name
     FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.name);
}

// HELPER: HASH REFRESH TOKEN
async function hashRefreshToken(token) {
  return await bcrypt.hash(token, 10);
}

// REGISTER SERVICE
async function registerUser(username, email, password) {
  // Validasi input
  if (!username || !email || !password) {
    throw {
      status: 400,
      message: 'Data tidak lengkap',
    };
  }

  // Validasi email format
  if (!validator.isEmail(email)) {
    throw {
      status: 400,
      message: 'Email tidak valid',
    };
  }

  // Validasi password length
  if (password.length < 6) {
    throw {
      status: 400,
      message: 'Password minimal 6 karakter',
    };
  }

  try {
    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    const userId = result.rows[0].id;

    // Assign default role
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'user'`,
      [userId]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw {
        status: 409,
        message: 'Email atau username sudah digunakan',
      };
    }
    throw error;
  }
}

// LOGIN SERVICE
async function loginUser(email, password) {
  // Validasi input
  if (!email || !password) {
    throw {
      status: 400,
      message: 'Data tidak lengkap',
    };
  }

  // Cari user berdasarkan email
  const userResult = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (userResult.rows.length === 0) {
    throw {
      status: 401,
      message: 'User tidak ditemukan',
    };
  }

  const user = userResult.rows[0];

  // Validasi password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw {
      status: 401,
      message: 'Password salah',
    };
  }

  // Dapatkan roles user
  const roles = await getUserRoles(user.id);

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, roles });
  const refreshToken = generateRefreshToken(user.id);

  // Hash dan simpan refresh token
  const hashedToken = await hashRefreshToken(refreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [user.id, hashedToken]
  );

  // Limit devices (max 5 session)
  await pool.query(
    `DELETE FROM refresh_tokens
     WHERE user_id = $1
     AND id NOT IN (
       SELECT id FROM refresh_tokens
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5
     )`,
    [user.id]
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles,
    },
  };
}

// REFRESH TOKEN SERVICE
async function refreshAccessToken(token) {
  if (!token) {
    throw {
      status: 401,
      message: 'Token tidak disediakan',
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw {
      status: 403,
      message: 'Token tidak valid',
    };
  }

  // Cari refresh token di database
  const result = await pool.query(
    `SELECT * FROM refresh_tokens 
     WHERE user_id = $1 AND expires_at > NOW()`,
    [decoded.id]
  );

  let validTokenRow = null;

  // Validasi token
  for (const row of result.rows) {
    const isValid = await bcrypt.compare(token, row.token);
    if (isValid) {
      validTokenRow = row;
      break;
    }
  }

  if (!validTokenRow) {
    throw {
      status: 403,
      message: 'Token tidak valid',
    };
  }

  // Deteksi reuse token
  if (validTokenRow.is_used) {
    await pool.query(
      `DELETE FROM refresh_tokens WHERE user_id = $1`,
      [decoded.id]
    );

    throw {
      status: 403,
      message: 'Penggunaan ulang token terdeteksi. Semua sesi telah di-logout.',
    };
  }

  // Tandai token lama sebagai used
  await pool.query(
    `UPDATE refresh_tokens SET is_used = TRUE WHERE id = $1`,
    [validTokenRow.id]
  );

  // Dapatkan roles user terbaru
  const roles = await getUserRoles(decoded.id);

  // Generate token baru
  const newRefreshToken = generateRefreshToken(decoded.id);
  const hashedToken = await hashRefreshToken(newRefreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at, is_used)
     VALUES ($1, $2, NOW() + INTERVAL '7 days', FALSE)`,
    [decoded.id, hashedToken]
  );

  const newAccessToken = generateAccessToken({ id: decoded.id, roles });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

// LOGOUT SERVICE
async function logoutUser(token) {
  if (!token) {
    return true; // Logout tetap success meski tidak ada token
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return true; // Invalid token, tetap logout
  }

  // Cari dan delete refresh token
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE user_id = $1`,
    [decoded.id]
  );

  for (const row of result.rows) {
    const isValid = await bcrypt.compare(token, row.token);
    if (isValid) {
      await pool.query(`DELETE FROM refresh_tokens WHERE id = $1`, [row.id]);
      break;
    }
  }

  return true;
}

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
