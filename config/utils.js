'use strict'

const bcrypt = require('bcrypt');


exports.makePasswordHash = (password, done) => {
  bcrypt.hash(password, 10, (err, hash) => {
    done(err, hash);
  });
};


exports.validatePassword = (password, passwordHash, done) => {
  bcrypt.compare(password, passwordHash, (err, same) => {
    done(err, same);
  });
};