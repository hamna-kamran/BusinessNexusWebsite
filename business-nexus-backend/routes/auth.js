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

module.exports = router;
