const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  createErrorResponse,
} = require('../utils/constants');

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse(ERROR_MESSAGES.ACCESS_DENIED)
      );
    }

    next();
  };
}

module.exports = { authorizeRoles };