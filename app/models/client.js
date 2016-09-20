const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  dni: {
    type: String,
    default: null
  },
  telf: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  zipcode: {
    type: String, 
    default: null
  },
  city: {
    type: String, 
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

ClientSchema.pre('save', (next) => {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (this.created_at) {
    this.created_at = currentDate;
  }

  next();
});

module.exports = mongoose.model('Client', ClientSchema);
