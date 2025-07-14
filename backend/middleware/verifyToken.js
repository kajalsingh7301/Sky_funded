//verify token

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ success: false, msg: 'Token is invalid or expired' });
    }

    console.log('Decoded JWT payload:', decoded);  // <-- add this debug

    // Normalize user info to always have _id
    req.user = {
      ...decoded,
      _id: decoded.id || decoded._id || decoded.userId,  // <-- add userId fallback just in case
    };

    console.log('Normalized req.user:', req.user);  // <-- add this debug

    next();
  });
}

module.exports = verifyToken;
