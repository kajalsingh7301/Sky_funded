


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const Admin = require('../models/Admin'); // Optional: if you use admins separately

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      country,
      referralId,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username or email already exists' });
    }

    const newUser = new User({
      username,
      fullName,
      email,
      phone,
      password, // Let Mongoose pre-save hook hash this
      country,
      referralId,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// LOGIN USER or ADMIN
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({
      $or: [{ username: username || '' }, { email: email || '' }],
    });

    let role = 'user';

    if (!user) {
      user = await Admin.findOne({
        $or: [{ username: username || '' }, { email: email || '' }],
      });

      if (user) {
        role = 'admin';
      }
    }

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || '',
        phone: user.phone || '',
        role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// LOGOUT (client-side handling)
router.post('/logout', (req, res) => {
  res.status(200).json({ msg: 'Logout successful' });
});

module.exports = router;
