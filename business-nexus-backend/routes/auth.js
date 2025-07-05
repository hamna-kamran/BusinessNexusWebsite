const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res) => {
  const { name,email,password,role } = req.body;
  if (!name||!email||!password||!role) return res.status(400).json({ msg: 'All fields required' });
  if (await User.findOne({ email })) return res.status(400).json({ msg: 'Email taken' });

  const hash = await bcrypt.hash(password,10);
  const user = await new User({ name,email,password:hash,role }).save();
  const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:'1d' });

  res.json({ token, user:{ id:user._id,name,email,role } });
});

router.post('/login', async (req,res) => {
  const { email,password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password,user.password)) 
    return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:'1d' });
  res.json({ token, user:{ id:user._id,name:user.name,email,role:user.role } });
});

module.exports = router;
