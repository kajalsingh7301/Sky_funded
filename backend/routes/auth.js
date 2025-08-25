const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Admin = require('../models/Admin');

// ---------- EMAIL TRANSPORTER ----------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Small helper to build a case-insensitive exact match regex
const exactI = (val) => new RegExp(`^${String(val).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'i');

// ---------------- REGISTER USER ----------------
router.post('/register', async (req, res) => {
  try {
    let { username, fullName, email, phone, password, confirmPassword, country, referralId } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    // Normalize
    email = email.trim().toLowerCase();
    username = username.trim();

    // Uniqueness check
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username or email already exists' });
    }

    // ❌ DO NOT hash here — pre('save') in User model already hashes the password
    const newUser = new User({
      username,
      fullName,
      email,
      phone,
      password,     // <-- plain text; model hook will hash
      country,
      referralId,
    });

    await newUser.save();

    // Send welcome email (non-blocking)
    const mailOptions = {
      from: `"TreasureFunded" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to TreasureFunded!',
      html: `
        <h2>Welcome, ${fullName || username}!</h2>
        <p>Thank you for registering at TreasureFunded.</p>
        <p>You can now log in and start your trading journey!</p>
        <br/>
        <p>Happy Trading 🚀</p>
      `,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Error sending welcome email:', err);
      else console.log('Welcome email sent:', info.response);
    });

    res.status(201).json({
      msg: 'User registered successfully',
      user: { userId: newUser._id, email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------- LOGIN USER (EMAIL OR USERNAME) ----------------
router.post('/login', async (req, res) => {
  try {
    let { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ msg: 'Please provide email/username and password' });
    }

    // Normalize identifiers; DO NOT trim password
    email = email ? email.trim().toLowerCase() : null;
    username = username ? username.trim() : null;

    let user = null;

    if (email) {
      // Email is stored lowercase in schema, so this should match
      user = await User.findOne({ email });
      // Legacy fallback (if some documents were saved with wrong casing)
      if (!user) user = await User.findOne({ email: exactI(email) });
    } else if (username) {
      // Username match + optional case-insensitive fallback
      user = await User.findOne({ username });
      if (!user) user = await User.findOne({ username: exactI(username) });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare raw password against hashed password from DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: { userId: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------- LOGIN ADMIN ----------------
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Please provide admin username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Invalid admin credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid admin credentials' });

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      msg: 'Admin login successful',
      token,
      admin: { adminId: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------- LOGOUT USER ----------------
router.post('/logout', (req, res) => {
  res.status(200).json({ msg: 'Logged out successfully' });
});

module.exports = router;
