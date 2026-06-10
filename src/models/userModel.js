const { pool } = require('../config/db');

const User = {
  async create(username, email, passwordHash) {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at;
    `;
    const result = await pool.query(query, [username, email, passwordHash]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT id, username, email, avatar, created_at, updated_at
      FROM users
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = `
      SELECT id, username, email, password_hash, avatar, created_at, updated_at
      FROM users
      WHERE email = $1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findByUsername(username) {
    const query = `
      SELECT id, username, email, avatar, created_at, updated_at
      FROM users
      WHERE username = $1;
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.username) {
      fields.push(`username = $${paramCount++}`);
      values.push(data.username);
    }
    if (data.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.password_hash) {
      fields.push(`password_hash = $${paramCount++}`);
      values.push(data.password_hash);
    }
    if (data.avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(data.avatar);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, avatar, created_at, updated_at;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
  },
};

module.exports = User;
