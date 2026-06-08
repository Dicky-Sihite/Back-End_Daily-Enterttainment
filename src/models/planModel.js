const { pool } = require('../config/db');

const Plan = {
  async create(data) {
    const {
      name,
      slug,
      price,
      durationDays,
      description,
      isActive = true,
    } = data;

    const query = `
      INSERT INTO plans (name, slug, price, duration_days, description, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      name,
      slug,
      price,
      durationDays,
      description,
      isActive,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM plans WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findBySlug(slug) {
    const query = `SELECT * FROM plans WHERE slug = $1;`;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  },

  async findAll(activeOnly = true) {
    let query = `SELECT * FROM plans`;
    if (activeOnly) {
      query += ` WHERE is_active = TRUE`;
    }
    query += ` ORDER BY price ASC;`;

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
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (data.durationDays) {
      fields.push(`duration_days = $${paramCount++}`);
      values.push(data.durationDays);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE plans
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM plans WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Plan;
