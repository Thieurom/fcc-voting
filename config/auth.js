'use strict'

const passport = require('./passport');


exports.login = (successPath, failurePath) => {
  return passport.authenticate('local', {
    successRedirect: successPath,
    failureRedirect: failurePath,
    failureFlash: true
  });
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};