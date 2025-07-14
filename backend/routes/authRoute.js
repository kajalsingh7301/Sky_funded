const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// --------- REGISTER ---------
router.post('/register', async (req, res) => {
  const {
    username,
    fullName,
    email,
    phone,
    password,
    confirmPassword,
    country,
    referralId
  } = req.body;

  try {
    if (!username || !email || !password || password !== confirmPassword) {
      return res.status(400).json({ msg: 'Invalid input or passwords do not match' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new User({
      username,
      fullName,
      email,
      phone,
      password,
      country,
      referralId,
      role: 'user' // default role
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// --------- LOGIN ---------
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!password || (!username && !email)) {
      return res.status(400).json({ msg: 'Please provide username or email and password' });
    }

    const query = email ? { email } : { username };
    const user = await User.findOne(query);

    if (!user) {
      // Use generic message to prevent info leak
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Use generic message here as well
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
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
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// --------- GET PROFILE (protected) ---------
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
