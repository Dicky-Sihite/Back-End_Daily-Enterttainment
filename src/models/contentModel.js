const { pool } = require('../config/db');

const ContentModel = {
  create: async ({ title, description, category_id, user_id, thumbnail, url }) => {
    const query = `
      INSERT INTO contents (title, description, category_id, user_id, thumbnail, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, description, category_id, user_id, thumbnail, url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async () => {
    const query = `
      SELECT c.*, cat.name as category_name, u.username as author_name
      FROM contents c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = `
      SELECT c.*, cat.name as category_name, u.username as author_name
      FROM contents c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = ContentModel;
