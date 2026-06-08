const { pool } = require('../config/db');

const UserRole = {
  async assignRole(userId, roleId) {
    const query = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, role_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, roleId]);
    return result.rows[0];
  },

  async removeRole(userId, roleId) {
    const query = `
      DELETE FROM user_roles
      WHERE user_id = $1 AND role_id = $2;
    `;
    await pool.query(query, [userId, roleId]);
  },

  async findByUserId(userId) {
    const query = `
      SELECT r.* FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findByRoleId(roleId) {
    const query = `
      SELECT u.id, u.username, u.email FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role_id = $1;
    `;
    const result = await pool.query(query, [roleId]);
    return result.rows;
  },

  async hasRole(userId, roleSlug) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = $1 AND r.slug = $2
      );
    `;
    const result = await pool.query(query, [userId, roleSlug]);
    return result.rows[0].exists;
  },
};

module.exports = UserRole;
