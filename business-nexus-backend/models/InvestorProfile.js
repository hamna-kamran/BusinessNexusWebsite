const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  investmentInterests: {
    type: String,
    required: true
  },
  portfolioCompanies:{ type: [String], default: [] },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InvestorProfile', investorProfileSchema);
