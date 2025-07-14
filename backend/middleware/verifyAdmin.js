// middleware/verifyAdmin.js
const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }

  // Check admin flag from req.user set by authMiddleware
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, msg: "Access denied: Admins only" });
  }

  next();
};

module.exports = verifyAdmin;
