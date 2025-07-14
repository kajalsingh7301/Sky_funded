const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

if (typeof authenticateToken !== 'function') {
  throw new Error('authenticateToken middleware is not a function!');
}
if (typeof authorizeRoles !== 'function') {
  throw new Error('authorizeRoles middleware is not a function!');
}

const router = express.Router();

// Multer storage setup
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

// Register route
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
      role: 'user',
    });

    await newUser.save();
    return res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ msg: 'Please provide username or email and password' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: username || '' }, { email: email || '' }],
    });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all users (admin only)
router.get('/admin/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (err) {
    console.error('Admin users fetch error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update profile
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  const { fullName, email, phone, country } = req.body;

  if (!fullName || !email || !phone || !country) {
    return res.status(400).json({ msg: 'All fields are required to update profile' });
  }

  const updateFields = { fullName, email, phone, country };

  if (req.file) {
    updateFields.profileImageUrl = `/uploads/profile_images/${req.file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    return res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ msg: 'Profile update failed', error: err.message });
  }
});

// Change password
router.put('/profile/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'Please provide all fields' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: 'New password and confirm password do not match' });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      msg: 'Password must be at least 8 characters, include one uppercase letter and one number',
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    user.password = newPassword; 
    await user.save();

    return res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ msg: 'Failed to update password', error: err.message });
  }
});


router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Fetch user by username error:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;


