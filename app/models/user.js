const mongoose = require('mongoose');
const config = require('../../config');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(config.saltRounds, function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err); }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.validatePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, res) {
    if (err) { return cb(err); }

    cb(null, res);
  });
};

module.exports = mongoose.model('User', UserSchema);
