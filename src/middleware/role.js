function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    next();
  };
}

module.exports = { authorizeRoles };