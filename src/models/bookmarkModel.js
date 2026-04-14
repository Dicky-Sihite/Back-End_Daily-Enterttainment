const { pool } = require('../config/db');

const BookmarkModel = {
  addBookmark: async (user_id, content_id) => {
    const query = `
      INSERT INTO bookmarks (user_id, content_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, content_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, content_id]);
    return rows[0];
  },

  removeBookmark: async (user_id, content_id) => {
    const query = `
      DELETE FROM bookmarks
      WHERE user_id = $1 AND content_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, content_id]);
    return rows[0];
  },

  findByUser: async (user_id) => {
    const query = `
      SELECT b.id as bookmark_id, b.created_at, c.*, cat.name as category_name
      FROM bookmarks b
      JOIN contents c ON b.content_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
};

module.exports = BookmarkModel;
