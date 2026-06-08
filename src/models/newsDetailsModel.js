const { pool } = require('../config/db');

const NewsDetails = {
  async create(contentId, data) {
    const {
      author,
      body,
      source,
      publishedAt,
    } = data;

    const query = `
      INSERT INTO news_details 
      (content_id, author, body, source, published_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      contentId,
      author,
      body,
      source,
      publishedAt,
    ]);
    return result.rows[0];
  },

  async findByContentId(contentId) {
    const query = `SELECT * FROM news_details WHERE content_id = $1;`;
    const result = await pool.query(query, [contentId]);
    return result.rows[0];
  },

  async update(contentId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.author) {
      fields.push(`author = $${paramCount++}`);
      values.push(data.author);
    }
    if (data.body) {
      fields.push(`body = $${paramCount++}`);
      values.push(data.body);
    }
    if (data.source) {
      fields.push(`source = $${paramCount++}`);
      values.push(data.source);
    }
    if (data.publishedAt) {
      fields.push(`published_at = $${paramCount++}`);
      values.push(data.publishedAt);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(contentId);

    const query = `
      UPDATE news_details
      SET ${fields.join(', ')}
      WHERE content_id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(contentId) {
    const query = `DELETE FROM news_details WHERE content_id = $1;`;
    await pool.query(query, [contentId]);
  },
};

module.exports = NewsDetails;
