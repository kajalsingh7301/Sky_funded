const User = require('../models/User'); // Assuming you're using mongoose for MongoDB
const sendEmail = require('../utils/sendEmail');

// Fetch user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      profileImage: user.profileImage,
      emailNotifications: user.emailNotifications,
      smsAlerts: user.smsAlerts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { fullName, email, phone, country, profileImage } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({ message: 'User details updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user details', error: err });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, smsAlerts } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.emailNotifications = emailNotifications !== undefined ? emailNotifications : user.emailNotifications;
    user.smsAlerts = smsAlerts !== undefined ? smsAlerts : user.smsAlerts;

    await user.save();

    res.json({ message: 'Notification preferences updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification preferences', error: err });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await user.comparePassword(currentPassword); // Assuming you've implemented comparePassword method in your User model
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // Assuming password hashing is handled in pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err });
  }
};
