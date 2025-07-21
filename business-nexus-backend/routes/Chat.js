const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Chat = require('../models/Chat');

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
  const userId1 = req.user._id;
  const userId2 = req.params.userId;

  try {
    const messages = await Chat.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Chat Fetch Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  const { receiver, message } = req.body;
  const sender = req.user._id;

  try {
    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ msg: 'Server error coming' });
  }
});

module.exports = router;
