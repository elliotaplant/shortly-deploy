var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

db.userSchema.pre('save', function(next) {
  this.createdAt = new Date();
  if (this.isNew) {
    this.createdAt = this.createdAt;
    this.hashPassword();
  }
  next();
});

db.userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      this.save();
    });
};

db.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', db.userSchema);
module.exports = User;
