const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

// REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// REFRESH TOKEN
router.post('/refresh', refresh);

// LOGOUT
router.post('/logout', logout);

// ADMIN route
router.get(
  '/admin',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: 'Welcome Admin' });
  }
);

// USER route
router.get(
  '/user',
  authenticateToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.json({ message: 'Welcome User' });
  }
);

module.exports = router;
