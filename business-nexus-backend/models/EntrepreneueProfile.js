const mongoose = require('mongoose');

const EntrepreneurProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  startupDescription: {
    type: String,
    required: true,
  },
  fundingNeed: {
    type: String,
    required: true,
  },
  pitchDeck: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EntrepreneurProfile', EntrepreneurProfileSchema);
