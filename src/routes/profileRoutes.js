const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, controller.upsert);
router.get('/', authenticateToken, controller.get);
router.delete('/', authenticateToken, controller.remove);

module.exports = router;