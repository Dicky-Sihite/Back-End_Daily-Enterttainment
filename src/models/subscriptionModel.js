const { pool } = require('../config/db');

const Subscription = {
  async create(data) {
    const {
      userId,
      planId,
      status = 'pending',
      startedAt,
      endsAt,
      autoRenew = false,
    } = data;

    const query = `
      INSERT INTO subscriptions 
      (user_id, plan_id, status, started_at, ends_at, auto_renew)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      userId,
      planId,
      status,
      startedAt,
      endsAt,
      autoRenew,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT s.*, p.name as plan_name, p.price
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE s.id = $1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT s.*, p.name as plan_name, p.price
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findActiveByUserId(userId) {
    const query = `
      SELECT s.*, p.name as plan_name, p.price
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = $1 AND s.status = 'active'
      ORDER BY s.created_at DESC
      LIMIT 1;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.status) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.startedAt) {
      fields.push(`started_at = $${paramCount++}`);
      values.push(data.startedAt);
    }
    if (data.endsAt) {
      fields.push(`ends_at = $${paramCount++}`);
      values.push(data.endsAt);
    }
    if (data.autoRenew !== undefined) {
      fields.push(`auto_renew = $${paramCount++}`);
      values.push(data.autoRenew);
    }
    if (data.cancelledAt) {
      fields.push(`cancelled_at = $${paramCount++}`);
      values.push(data.cancelledAt);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE subscriptions
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async cancel(id) {
    const query = `
      UPDATE subscriptions
      SET status = 'canceled', cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM subscriptions WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Subscription;
