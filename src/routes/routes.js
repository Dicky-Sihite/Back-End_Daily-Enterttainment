const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { createContent, getAllContents, getContentById } = require('../controllers/contentController');
const { addBookmark, removeBookmark, getUserBookmarks } = require('../controllers/bookmarkController');
const { trackHistory, getUserHistory } = require('../controllers/historyController');
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  createSuccessResponse,
} = require('../utils/constants');

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
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_ADMIN)
    );
  }
);

// USER route
router.get(
  '/user',
  authenticateToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_USER)
    );
  }
);

// CONTENT routes
router.post('/contents', authenticateToken, createContent);
router.get('/contents', getAllContents);
router.get('/contents/:id', getContentById);

// BOOKMARK routes
router.post('/bookmarks', authenticateToken, addBookmark);
router.delete('/bookmarks/:contentId', authenticateToken, removeBookmark);
router.get('/bookmarks', authenticateToken, getUserBookmarks);

// HISTORY routes
router.post('/histories', authenticateToken, trackHistory);
router.get('/histories', authenticateToken, getUserHistory);

module.exports = router;
