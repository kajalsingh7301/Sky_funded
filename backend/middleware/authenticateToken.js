// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Invalid or expired token' });
    req.user = user; // user contains the decoded payload { id, username, role }
    next();
  });
}

module.exports = authenticateToken;
