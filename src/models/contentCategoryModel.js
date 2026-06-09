const { pool } = require('../config/db');

const ContentCategory = {
  async addCategory(contentId, categoryId) {
    const query = `
      INSERT INTO content_categories (content_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (content_id, category_id) DO NOTHING
      RETURNING *;
    `;

    const result = await pool.query(query, [contentId, categoryId]);
    return result.rows[0];
  },

  async removeCategory(contentId, categoryId) {
    const query = `
      DELETE FROM content_categories
      WHERE content_id = $1 AND category_id = $2;
    `;

    await pool.query(query, [contentId, categoryId]);
  },

  async findByContentId(contentId) {
    const query = `
      SELECT c.* FROM categories c
      JOIN content_categories cc ON c.id = cc.category_id
      WHERE cc.content_id = $1;
    `;

    const result = await pool.query(query, [contentId]);
    return result.rows;
  },

  async findByCategoryId(categoryId) {
    const query = `
      SELECT c.* FROM contents c
      JOIN content_categories cc ON c.id = cc.content_id
      WHERE cc.category_id = $1 AND c.deleted_at IS NULL;
    `;

    const result = await pool.query(query, [categoryId]);
    return result.rows;
  },

  async deleteByContentId(contentId) {
    const query = `DELETE FROM content_categories WHERE content_id = $1;`;
    await pool.query(query, [contentId]);
  },
};

module.exports = ContentCategory;
