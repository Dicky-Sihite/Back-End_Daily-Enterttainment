const { pool } = require('../config/db');

const Payment = {
  async create(data) {
    const {
      subscriptionId,
      amount,
      paymentMethod,
      gateway,
      externalTransactionId,
      status = 'pending',
    } = data;

    const query = `
      INSERT INTO payments 
      (subscription_id, amount, payment_method, gateway, external_transaction_id, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      subscriptionId,
      amount,
      paymentMethod,
      gateway,
      externalTransactionId,
      status,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM payments WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findBySubscriptionId(subscriptionId) {
    const query = `
      SELECT * FROM payments
      WHERE subscription_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [subscriptionId]);
    return result.rows;
  },

  async findByExternalTransactionId(externalTransactionId) {
    const query = `
      SELECT * FROM payments
      WHERE external_transaction_id = $1;
    `;

    const result = await pool.query(query, [externalTransactionId]);
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
    if (data.paidAt) {
      fields.push(`paid_at = $${paramCount++}`);
      values.push(data.paidAt);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE payments
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async markAsPaid(id) {
    const query = `
      UPDATE payments
      SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async markAsRefunded(id) {
    const query = `
      UPDATE payments
      SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM payments WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};

module.exports = Payment;
