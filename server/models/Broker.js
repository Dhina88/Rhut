const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  minimumDeposit: {
    type: Number,
    required: true,
  },
  tradingPlatforms: [{
    type: String,
  }],
  regulatoryBodies: [{
    type: String,
  }],
  isPropFirm: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  referralLink: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Broker', brokerSchema); 