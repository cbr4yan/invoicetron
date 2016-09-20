const mongoose = require('mongoose');
const Clients = require('../models/client');

const InvoiceSchema = mongoose.Schema({
  invoice_number: {
    type: Number,
    required: true,
    index: {
      unique: true
    }
  },
  invoice_date: {
    type: Date,
    default: Date.now
  },
  _client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  items: [{
    quantity: {
      type: String,
      default: '*'},
    description: String,
    price: String,
    discount: String,
    amount: String
  }],
  subtotal: String,
  iva_perc: String,
  iva_amount: String,
  total: {
    type: String},
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

InvoiceSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead).pre('save', (next) => {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
