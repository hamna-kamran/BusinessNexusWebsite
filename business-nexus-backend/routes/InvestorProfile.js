const express = require('express');
const router = express.Router();
const InvestorProfile = require('../models/InvestorProfile');
const auth = require('../middlewares/auth');

// Create Investor Profile
router.post('/profile', auth, async (req, res) => {
  try {
    const { bio, investmentInterests, portfolioCompanies } = req.body;

    const profile = new InvestorProfile({
      user: req.user.id,
      bio,
      investmentInterests,
      portfolioCompanies,
    });

    await profile.save();
    res.status(201).json({ msg: 'Investor profile created successfully' });
  } catch (err) {
    console.error('Error creating investor profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Investor Profile by User ID
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const profile = await InvestorProfile.findOne({ user: req.params.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Investor profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error fetching investor profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Investor Profile
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const { bio, investmentInterests, portfolioCompanies } = req.body;

    const profile = await InvestorProfile.findOneAndUpdate(
      { user: req.params.id },
      {
        bio,
        investmentInterests,
        portfolioCompanies,
      },
      { new: true, upsert: false }
    );

    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    res.json({ msg: 'Profile updated successfully', profile });
  } catch (err) {
    console.error('Error updating investor profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/profile/:id', auth, async (req, res) => {
  try {
    const deleted = await InvestorProfile.findOneAndDelete({ user: req.params.id });
    if (!deleted) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting investor profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/investor/all
router.get('/all', auth, async (req, res) => {
  try {
    const profiles = await InvestorProfile.find().populate('user', 'name email');

    const formatted = profiles
      .filter(p => p.user) // ✅ Ensure user is not null
      .map(p => ({
        _id: p._id,
        user: p.user._id,
        name: p.user.name,
        email: p.user.email,
        investmentInterests: p.investmentInterests,
        portfolioCompanies: p.portfolioCompanies || [],
      }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching investors:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});






module.exports = router;
