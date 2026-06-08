const { pool } = require('../config/db');

const ContentType = {
  async create(name, slug) {
    const query = `
      INSERT INTO content_types (name, slug)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, slug]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM content_types WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findBySlug(slug) {
    const query = `SELECT * FROM content_types WHERE slug = $1;`;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  },

  async findByName(name) {
    const query = `SELECT * FROM content_types WHERE name = $1;`;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  async findAll() {
    const query = `SELECT * FROM content_types ORDER BY created_at;`;
    const result = await pool.query(query);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.slug) {
      fields.push(`slug = $${paramCount++}`);
      values.push(data.slug);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE content_types
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM content_types WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = ContentType;
