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

    const role = fromUser.role?.toLowerCase();
    let newRequest;

    if (role === 'investor') {
      newRequest = new CollaborationRequest({
        investorId: fromUser._id,
        entrepreneurId: toUserId,
        senderId: fromUser._id,
      });
    } else if (role === 'entrepreneur') {
      newRequest = new CollaborationRequest({
        entrepreneurId: fromUser._id,
        investorId: toUserId,
        senderId: fromUser._id,
      });
    } else {
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
    }).populate('investorId entrepreneurId senderId', 'name email role');

    res.json(requests);
  } catch (err) {
    console.error('Fetch Requests Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH /api/collaborations/:id/status
router.patch('/:id/status', auth, async (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body; // "accept" or "reject"
  const userId = req.user._id;

  try {
    const request = await CollaborationRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    // Only receiver can update status
    const isReceiver =
      (request.investorId.toString() === userId.toString() && request.senderId.toString() !== userId.toString()) ||
      (request.entrepreneurId.toString() === userId.toString() && request.senderId.toString() !== userId.toString());

    if (!isReceiver) {
      return res.status(403).json({ msg: 'Only the receiver can respond to the request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request already responded to' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
    } else if (action === 'reject') {
      request.status = 'rejected';
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }

    await request.save();

    // In real case: here you can create a Chat room or initiate chat connection
    res.json({ msg: `Request ${action}ed`, request });
  } catch (err) {
    console.error('Update Request Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Add this at the bottom of your collaboration.js file
router.patch('/requests/:id/status', auth, async (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body;

  try {
    const request = await CollaborationRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request already processed' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
    } else if (action === 'reject') {
      request.status = 'rejected';
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }

    await request.save();
    res.json({ msg: `Request ${action}ed`, request });
  } catch (err) {
    console.error('Status Update Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
