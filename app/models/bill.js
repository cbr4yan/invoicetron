const mongoose = require('mongoose');
const Clients = require('../models/client');

const BillSchema = mongoose.Schema({
  bill_number: {
    type: Number,
    required: true,
    index: {
      unique: true
    }
  },
  bill_date: {
    type: Date,
    default: Date.now
  },
  _client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  description: String,
  totalStr: String,
  total: { type: String },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});


var autoPopulateLead = function(next) {
  this.populate('_client');
  next();
};

BillSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead).pre('save', (next) => {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

module.exports = mongoose.model('Bill', BillSchema);
