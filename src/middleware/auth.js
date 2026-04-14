const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  createErrorResponse,
} = require('../utils/constants');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createErrorResponse(ERROR_MESSAGES.TOKEN_NOT_PROVIDED)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse(ERROR_MESSAGES.INVALID_TOKEN)
      );
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };