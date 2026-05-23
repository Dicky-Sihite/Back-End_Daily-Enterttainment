const { pool } = require('../config/db');

const RefreshToken = {
  async create(userId, token, expiresAt) {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, token, expiresAt]);
    return result.rows[0];
  },

  async findByToken(token) {
    const query = `
      SELECT * FROM refresh_tokens
      WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP;
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  },

  async markAsUsed(token) {
    const query = `
      UPDATE refresh_tokens
      SET is_used = TRUE
      WHERE token = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT * FROM refresh_tokens
      WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async delete(token) {
    const query = `
      DELETE FROM refresh_tokens
      WHERE token = $1;
    `;
    await pool.query(query, [token]);
  },

  async deleteByUserId(userId) {
    const query = `
      DELETE FROM refresh_tokens
      WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);
  },
};

module.exports = RefreshToken;
