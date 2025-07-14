// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const User = require('../models/User');
// const Admin = require('../models/Admin');

// async function authenticateToken(req, res, next) {
//   try {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ msg: 'Authorization token missing or malformed' });
//     }

//     const token = authHeader.split(' ')[1];
//     let decoded;

//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ msg: 'Token expired' });
//       }
//       return res.status(403).json({ msg: 'Invalid token' });
//     }

//     // Ensure decoded id exists and is valid
//     if (!decoded?.id) {
//       return res.status(403).json({ msg: 'Invalid token payload: Missing user id' });
//     }

//     if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
//       console.error('Invalid ObjectId in token payload:', decoded.id);
//       return res.status(403).json({ msg: 'Invalid token payload: malformed user ID' });
//     }

//     const decodedId = decoded.id.toString();

//     // Try finding the admin first
//     const admin = await Admin.findById(decodedId).select('-password');
//     if (admin) {
//       req.user = admin.toObject(); // convert mongoose document to plain object
//       req.user.role = 'admin';
//       return next();
//     }

//     // If not admin, try finding user
//     const user = await User.findById(decodedId).select('-password');
//     if (user) {
//       req.user = user.toObject();
//       req.user.role = 'user';
//       return next();
//     }

//     // If neither admin nor user found, unauthorized
//     return res.status(401).json({ msg: 'User not found' });

//   } catch (err) {
//     console.error('Authentication error:', err);
//     return res.status(403).json({ msg: 'Invalid token or internal error' });
//   }
// }

// function authorizeRoles(...allowedRoles) {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ msg: 'Unauthorized: No user info found' });
//     }

//     console.log('AuthorizeRoles: user role is', req.user.role);

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
//     }

//     next();
//   };
// }

// module.exports = {
//   authenticateToken,
//   authorizeRoles,
// };

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired' });
      }
      return res.status(403).json({ msg: 'Invalid token' });
    }

    if (!decoded?.id) {
      return res.status(403).json({ msg: 'Invalid token payload: Missing user id' });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error('Invalid ObjectId in token payload:', decoded.id);
      return res.status(403).json({ msg: 'Invalid token payload: malformed user ID' });
    }

    const decodedId = decoded.id.toString();

    const admin = await Admin.findById(decodedId).select('-password');
    if (admin) {
      req.user = admin.toObject();
      req.user.role = 'admin';
      return next();
    }

    const user = await User.findById(decodedId).select('-password');
    if (user) {
      req.user = user.toObject();
      req.user.role = 'user';
      return next();
    }

    return res.status(401).json({ msg: 'User not found' });
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(403).json({ msg: 'Invalid token or internal error' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized: No user info found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};
