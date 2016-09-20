const Mongoose = require('mongoose');

const url = 'mongodb://localhost/invoicetron';

Mongoose.connect(url);

Mongoose.connection.on('error', (err) => {
  if (err) throw err;
});

Mongoose.Promise = global.Promise;

module.exports = Mongoose;
