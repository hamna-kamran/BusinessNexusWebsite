const express = require('express');
const router = express.Router();
const EntrepreneurProfile = require('../models/EntrepreneueProfile');
const auth = require('../middlewares/auth');

// Create Entrepreneur Profile
router.post('/profile', auth, async (req, res) => {
  try {
    const { bio, startupDescription, fundingNeed, pitchDeck } = req.body;

    const profile = new EntrepreneurProfile({
      user: req.user.id, // Comes from JWT middleware
      bio,
      startupDescription,
      fundingNeed,
      pitchDeck,
    });

    await profile.save();
    res.status(201).json({ msg: 'Profile created successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Entrepreneur Profile
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const { bio, startupDescription, fundingNeed, pitchDeck } = req.body;

    const updatedProfile = await EntrepreneurProfile.findOneAndUpdate(
      { user: req.params.id },
      {
        bio,
        startupDescription,
        fundingNeed,
        pitchDeck,
      },
      { new: true, upsert: false }
    );

    if (!updatedProfile) {
      return res.status(404).json({ msg: 'Entrepreneur profile not found' });
    }

    res.json({ msg: 'Entrepreneur profile updated successfully', profile: updatedProfile });
  } catch (err) {
    console.error('Error updating entrepreneur profile:', err);
    res.status(500).json({ msg: 'Server error while updating profile' });
  }
});

router.delete('/profile/:id', auth, async (req, res) => {
  try {
    const deleted = await EntrepreneurProfile.findOneAndDelete({ user: req.params.id });
    if (!deleted) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting entrepreneur profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Entrepreneur Profile
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.params.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Entrepreneur profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error fetching entrepreneur profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all entrepreneur profiles
router.get('/all', auth, async (req, res) => {
  try {
    const profiles = await EntrepreneurProfile.find().populate('user', 'name email');

    // Filter out profiles with missing user
    const validProfiles = profiles.filter(p => p.user !== null);

    const formattedProfiles = validProfiles.map(p => ({
      _id: p._id,
      user: p.user._id,
      name: p.user.name,
      email: p.user.email,
      bio: p.bio,
      startupDescription: p.startupDescription,
    }));

    res.json(formattedProfiles);
  } catch (err) {
    console.error('Error fetching entrepreneurs:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




module.exports = router;
