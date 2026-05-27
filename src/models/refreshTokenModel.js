const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const RefreshToken = {
  async create(userId, token, expiresAt) {
    // Hash token before storing
    const hashedToken = await bcrypt.hash(token, 10);
    
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, hashedToken, expiresAt]);
    return result.rows[0];
  },

  async findByToken(token) {
    const query = `
      SELECT * FROM refresh_tokens
      WHERE expires_at > CURRENT_TIMESTAMP;
    `;
    const result = await pool.query(query);
    
    // Find the matching token by comparing hashes
    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token);
      if (isValid) {
        return row;
      }
    }
    
    return null;
  },

  async markAsUsed(token) {
    const query = `
      SELECT * FROM refresh_tokens
      WHERE expires_at > CURRENT_TIMESTAMP;
    `;
    const result = await pool.query(query);
    
    // Find the matching token
    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token);
      if (isValid) {
        const updateQuery = `
          UPDATE refresh_tokens
          SET is_used = TRUE
          WHERE id = $1
          RETURNING *;
        `;
        const updateResult = await pool.query(updateQuery, [row.id]);
        return updateResult.rows[0];
      }
    }
    
    return null;
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
      SELECT * FROM refresh_tokens
      WHERE expires_at > CURRENT_TIMESTAMP;
    `;
    const result = await pool.query(query);
    
    // Find the matching token
    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token);
      if (isValid) {
        const deleteQuery = `
          DELETE FROM refresh_tokens
          WHERE id = $1;
        `;
        await pool.query(deleteQuery, [row.id]);
        return true;
      }
    }
    
    return false;
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
