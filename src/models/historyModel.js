const { pool } = require('../config/db');

const History = {
  async addHistory(userId, contentId) {
    const query = `
      INSERT INTO histories (
        user_id,
        content_id,
        viewed_at
      )
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, content_id)
      DO UPDATE SET
        viewed_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(query, [
      userId,
      contentId
    ]);

    return result.rows[0];
  },
  
  async findByUser(userId) {
    const query = `
      SELECT h.id as history_id, h.viewed_at, c.*, 
             ct.name as content_type_name,
             array_agg(DISTINCT cat.id) as category_ids,
             array_agg(DISTINCT cat.name) as category_names
      FROM histories h
      JOIN contents c ON h.content_id = c.id
      LEFT JOIN content_types ct ON c.content_type_id = ct.id
      LEFT JOIN content_categories cc ON c.id = cc.content_id
      LEFT JOIN categories cat ON cc.category_id = cat.id
      WHERE h.user_id = $1 AND c.deleted_at IS NULL
      GROUP BY h.id, h.viewed_at, c.id, ct.name
      ORDER BY h.viewed_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findByUserAndContent(userId, contentId) {
    const query = `
      SELECT * FROM histories
      WHERE user_id = $1 AND content_id = $2
      ORDER BY viewed_at DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async clearUserHistory(userId) {
    const query = `
      DELETE FROM histories
      WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);
  },
};

module.exports = History;
