// ✅ UPDATED userroutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

console.log("✅ userroutes.js loaded");

// ========== Multer Config ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/profile_images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/* ========== USER ROUTES ========== */

// ✅ Register
router.post('/register', async (req, res) => {
  const { username, fullName, email, phone, password, confirmPassword, country, referralId } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      username,
      fullName,
      email,
      phone,
      password,
      country,
      referralId,
      role: username === 'admin' ? 'admin' : 'user',
      approvalStatus: 'pending',
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ msg: 'Please provide username/email and password' });
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' });

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
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ Update profile
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  const { fullName, email, phone, country } = req.body;

  const updateFields = { fullName, email, phone, country };
  if (req.file) {
    updateFields.profileImageUrl = `/uploads/profile_images/${req.file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
    }).select('-password');

    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Profile update failed', error: err.message });
  }
});

// ✅ Change password
router.put('/profile/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Password update failed', error: err.message });
  }
});

/* ========== ADMIN ROUTES ========== */

// ✅ Approve/Decline/Delete
router.put('/approve/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'declined', 'pending', 'deleted'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { approvalStatus: status }, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update status', error: err.message });
  }
});

// ✅ All users (Admin only)
router.get('/all-users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch all users', error: err.message });
  }
});

// ✅ Approved users only
router.get('/approved-data', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find({ approvalStatus: 'approved' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch approved users', error: err.message });
  }
});

// ✅ Get single user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
