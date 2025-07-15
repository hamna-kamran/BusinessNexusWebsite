const express = require('express');
const router = express.Router();
const CollaborationRequest = require('../models/CollaborationRequest');
const auth = require('../middlewares/auth'); // ✅ this is correct
const User = require('../models/User');      // ✅ also needed


router.post('/request', auth, async (req, res) => {
  const { toUserId } = req.body;
  const userId = req.user._id;

  try {
    const fromUser = await User.findById(userId);
    if (!fromUser) return res.status(404).json({ msg: 'User not found' });

    console.log('fromUser.role =', fromUser.role);

    const role = fromUser.role?.toLowerCase();
    let newRequest;

    if (role === 'investor') {
      newRequest = new CollaborationRequest({
        investorId: fromUser._id,
        entrepreneurId: toUserId,
      });
    } else if (role === 'entrepreneur') {
      newRequest = new CollaborationRequest({
        entrepreneurId: fromUser._id,
        investorId: toUserId,
      });
    } else {
      console.error('Unexpected role value:', fromUser.role);
      return res.status(400).json({ msg: 'Invalid role for sending request' });
    }

    await newRequest.save();
    return res.status(201).json({ msg: 'Request sent', request: newRequest });
  } catch (err) {
    console.error('Send Request Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/requests', auth, async (req, res) => {
  const userId = req.user._id;

  try {
    const requests = await CollaborationRequest.find({
      $or: [
        { investorId: userId },
        { entrepreneurId: userId },
      ],
    }).populate('investorId entrepreneurId', 'name email role');

    res.json(requests);
  } catch (err) {
    console.error('Fetch Requests Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
