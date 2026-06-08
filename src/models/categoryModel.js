const { pool } = require('../config/db');

const Category = {
  async create(name, slug, description) {
    const query = `
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, slug, description]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM categories WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findBySlug(slug) {
    const query = `SELECT * FROM categories WHERE slug = $1;`;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  },

  async findAll() {
    const query = `SELECT * FROM categories ORDER BY created_at;`;
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
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE categories
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM categories WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Category;
