const express = require('express');
const router = express.Router();
const CollaborationRequest = require('../models/CollaborationRequest');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use another like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendNotificationEmail = async (toEmail, senderName) => {
  const mailOptions = {
    from: `"Collaboration Platform" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'New Collaboration Request',
    text: `${senderName} has sent you a new collaboration request.`,
    html: `<p><strong>${senderName}</strong> has sent you a new <b>collaboration request</b>. Please login to respond.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${toEmail}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// POST: Send a request
router.post('/request', auth, async (req, res) => {
  const { toUserId } = req.body;
  const userId = req.user._id;

  try {
    const fromUser = await User.findById(userId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ msg: 'User not found' });

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

    // Send email notification
    await sendNotificationEmail(toUser.email, fromUser.name);

    return res.status(201).json({ msg: 'Request sent', request: newRequest });
  } catch (err) {
    console.error('Send Request Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: All requests for logged-in user
router.get('/requests', auth, async (req, res) => {
  const userId = req.user._id;

  try {
    const requests = await CollaborationRequest.find({
      $or: [{ investorId: userId }, { entrepreneurId: userId }],
    }).populate('investorId entrepreneurId senderId', 'name email role');

    res.json(requests);
  } catch (err) {
    console.error('Fetch Requests Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH: Accept or Reject request
router.patch('/requests/:id/status', auth, async (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body;

  const actionMap = { accept: 'accepted', reject: 'rejected' };
  if (!actionMap[action]) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    let request = await CollaborationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const userId = req.user._id;
    const isReceiver =
      (request.investorId.toString() === userId && request.senderId.toString() !== userId) ||
      (request.entrepreneurId.toString() === userId && request.senderId.toString() !== userId);

    if (!isReceiver) {
      return res.status(403).json({ message: 'Only the receiver can respond' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = actionMap[action];
    await request.save();

    // Fetch full populated request
    const populated = await CollaborationRequest.findById(requestId).populate(
      'investorId entrepreneurId senderId',
      'name email role'
    );

    const sender = populated.senderId;
    const receiver =
      sender._id.toString() === populated.investorId._id.toString()
        ? populated.entrepreneurId
        : populated.investorId;

    // Send email to sender notifying about action
    await sendNotificationEmail(
      sender.email,
      `Your Collaboration Request was ${request.status}`
    );

    return res.json({ message: `Request ${request.status}`, request: populated });
  } catch (err) {
    console.error('Error updating request status:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});





module.exports = router;
