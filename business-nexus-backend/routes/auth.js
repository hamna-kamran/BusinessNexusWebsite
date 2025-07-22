// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields required' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'Email taken' });

  const hash = await bcrypt.hash(password, 10);
  const user = await new User({ name, email, password: hash, role }).save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      _id: user._id,   // ✅ use _id instead of id
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      _id: user._id,   // ✅ use _id instead of id
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Current User
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Update Name or Email
router.patch('/update-profile', authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ msg: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating profile' });
  }
});

// ✅ Change Password
router.patch('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Error changing password' });
  }
});

// ❌ Delete Account
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting account' });
  }
});
module.exports = router;
