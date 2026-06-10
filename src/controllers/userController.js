const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// GET ALL USERS WITH ROLES & SUBSCRIPTION TYPE
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.username,
        u.username AS name,
        u.email,
        u.avatar,
        u.created_at AS joined,
        CASE
          WHEN EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.user_id = u.id AND s.status = 'active' AND s.ends_at > CURRENT_TIMESTAMP
          ) THEN 'PREMIUM'
          ELSE 'REGULAR'
        END AS type,
        COALESCE(
          (SELECT r.slug FROM user_roles ur
           JOIN roles r ON r.id = ur.role_id
           WHERE ur.user_id = u.id
           ORDER BY CASE WHEN r.slug = 'admin' THEN 1 WHEN r.slug = 'moderator' THEN 2 ELSE 3 END
           LIMIT 1),
          'user'
        ) AS role,
        COALESCE(
          ARRAY_AGG(r.slug)
          FILTER (WHERE r.slug IS NOT NULL),
          '{}'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      GROUP BY u.id
      ORDER BY u.id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users'
    });
  }
};

// CREATE A NEW USER (WITH ROLE)
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    const insertUserQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at;
    `;
    const userRes = await client.query(insertUserQuery, [username, email, passwordHash]);
    const user = userRes.rows[0];

    // Assign Role
    const roleSlug = role || 'user';
    const roleRes = await client.query('SELECT id FROM roles WHERE slug = $1', [roleSlug]);
    if (roleRes.rows.length > 0) {
      const roleId = roleRes.rows[0].id;
      await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleId]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.email,
        role: roleSlug,
        type: 'REGULAR'
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create user error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user'
    });
  } finally {
    client.release();
  }
};

// UPDATE AN EXISTING USER (DETAILS & ROLE)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, password, avatar } = req.body;

  const requesterId = req.user ? (req.user.id || req.user.userId) : null;
  const requesterRoles = req.user ? req.user.roles : [];
  const isAdmin = requesterRoles.includes('admin');

  // If not admin and not updating themselves, deny access
  if (!isAdmin && String(requesterId) !== String(id)) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare fields to update
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (username) {
      updates.push(`username = $${paramIndex++}`);
      values.push(username);
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (password) {
      const passwordHash = await bcrypt.hash(password, 12);
      updates.push(`password_hash = $${paramIndex++}`);
      values.push(passwordHash);
    }
    if (avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`);
      values.push(avatar);
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const updateQuery = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, username, email, avatar;
      `;
      await client.query(updateQuery, values);
    }

    // Update role if provided (only admins can change roles)
    if (role && isAdmin) {
      // Clear existing roles
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);
      
      // Get target role ID
      const roleRes = await client.query('SELECT id FROM roles WHERE slug = $1', [role]);
      if (roleRes.rows.length > 0) {
        const roleId = roleRes.rows[0].id;
        await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [id, roleId]);
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update user error:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  } finally {
    client.release();
  }
};

// DELETE A USER
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user'
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
