const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');  


// REGISTER
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // validasi
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Email tidak valid' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    const userId = result.rows[0].id;

    // assign role default (user)
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'user'`,
      [userId]
    );

    res.status(201).json({
      message: 'User berhasil dibuat',
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    // duplicate
    if (error.code === '23505') {
      return res.status(400).json({
        message: 'Email atau username sudah digunakan',
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
}

// LOGIN

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: 'User tidak ditemukan' });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Password salah' });

    // ambil role
    const roleResult = await pool.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1`,
      [user.id]
    );
    const roles = roleResult.rows.map(r => r.name);

    // buat token
    const accessToken = jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // hash refresh token sebelum simpan
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, hashedToken]
    );

    // kirim cookie + access token
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

  async function refresh(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    // decode user_id dari JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.sendStatus(403);
    }

    // ambil semua token user yang belum expired
    const result = await pool.query(
      `SELECT * FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()`,
      [decoded.id]
    );

    if (result.rows.length === 0) return res.sendStatus(403);

    let validTokenRow = null;
    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token);
      if (isValid) {
        validTokenRow = row;
        break;
      }
    }

    if (!validTokenRow) return res.sendStatus(403);

  // hapus token lama
    await pool.query(`DELETE FROM refresh_tokens WHERE id = $1`, [validTokenRow.id]);

    // buat refresh token baru
    const newRefreshToken = jwt.sign(
      { id: user.id, roles },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // hash token baru
    const newHashed = await bcrypt.hash(newRefreshToken, 10);

    // simpan hash baru ke DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [decoded.id, newHashed]
    );

    // kirim cookie baru
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false, // pakai true kalau sudah HTTPS
      sameSite: 'strict'
    });

    // buat access token baru
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  }

  async function logout(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    // decode user_id
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.sendStatus(204);
    }

    // ambil semua token user
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

    res.clearCookie('refreshToken');
    res.sendStatus(204);
  }

  async function refresh(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.sendStatus(403);
    }

    // ambil token user
    const result = await pool.query(
      `SELECT * FROM refresh_tokens 
      WHERE user_id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) return res.sendStatus(403);

    let validTokenRow = null;

    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token);

      if (isValid) {
        validTokenRow = row;
        break;
      }
    }

    if (!validTokenRow) return res.sendStatus(403);

    // DETEKSI REUSE
    if (validTokenRow.is_used) {
      // HAPUS SEMUA TOKEN USER (force logout semua device)
      await pool.query(
        `DELETE FROM refresh_tokens WHERE user_id = $1`,
        [decoded.id]
      );

      return res.status(403).json({
        message: 'Token reuse terdeteksi. Semua sesi di-logout.',
      });
    }

    // tandai token lama sebagai used
    await pool.query(
      `UPDATE refresh_tokens SET is_used = TRUE WHERE id = $1`,
      [validTokenRow.id]
    );

    // BUAT TOKEN BARU
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const hashedToken = await bcrypt.hash(newRefreshToken, 10);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [decoded.id, hashedToken]
    );

    // access token baru
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ accessToken });
  }


module.exports = {
  register,
  login,
  refresh,
  logout,
};