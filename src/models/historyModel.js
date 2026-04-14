const { pool } = require('../config/db');

const HistoryModel = {
  addHistory: async (user_id, content_id) => {
    const query = `
      INSERT INTO histories (user_id, content_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, content_id]);
    return rows[0];
  },

  findByUser: async (user_id) => {
    const query = `
      SELECT h.id as history_id, h.viewed_at, c.*, cat.name as category_name
      FROM histories h
      JOIN contents c ON h.content_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE h.user_id = $1
      ORDER BY h.viewed_at DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
};

module.exports = HistoryModel;
