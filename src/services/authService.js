const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const RefreshToken = require('../models/refreshTokenModel');
const Role = require('../models/roleModel');

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
  const roles = await UserRole.findByUserId(userId);
  return roles.map(role => role.name);
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

    // Create user using model
    const user = await User.create(username, email, passwordHash);

    // Get user role and assign it
    const userRole = await Role.findByName('user');
    if (userRole) {
      await UserRole.assignRole(user.id, userRole.id);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
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

  // Find user by email using model
  const user = await User.findByEmail(email);

  if (!user) {
    throw {
      status: 401,
      message: 'User tidak ditemukan',
    };
  }

  // Validate password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw {
      status: 401,
      message: 'Password salah',
    };
  }

  // Get user roles
  const roles = await getUserRoles(user.id);

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, roles });
  const refreshToken = generateRefreshToken(user.id);

  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Save refresh token using model
  await RefreshToken.create(user.id, refreshToken, expiresAt);

  // Clean up old tokens (keep only 5 recent ones)
  const allTokens = await RefreshToken.findByUserId(user.id);
  if (allTokens.length > 5) {
    const tokensToDelete = allTokens.slice(5);
    for (const token of tokensToDelete) {
      await RefreshToken.delete(token.token);
    }
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
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

  // Cari dan validasi refresh token menggunakan model
  const validToken = await RefreshToken.findByToken(token);
  
  if (!validToken) {
    throw {
      status: 403,
      message: 'Token tidak valid',
    };
  }

  // Detect token reuse
  if (validToken.is_used) {
    await RefreshToken.deleteByUserId(decoded.id);

    throw {
      status: 403,
      message: 'Penggunaan ulang token terdeteksi. Semua sesi telah di-logout.',
    };
  }

  // Mark old token as used
  await RefreshToken.markAsUsed(token);

  // Get latest user roles
  const roles = await getUserRoles(decoded.id);

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken(decoded.id);

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Save new refresh token
  await RefreshToken.create(decoded.id, newRefreshToken, expiresAt);

  // Generate new access token
  const accessToken = generateAccessToken({ id: decoded.id, roles });

  return {
    accessToken,
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

  // Delete refresh token using model
  await RefreshToken.delete(token);

  return true;
}

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};