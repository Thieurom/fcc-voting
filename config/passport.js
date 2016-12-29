'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const User = require('../model/user');


// Config strategy
passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  process.nextTick(() => {
    User.getByName(username, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, req.flash('loginMsg', 'Incorrect username!'));
      }

      bcrypt.compare(password, user.passwordHash, (err, same) => {
        if (err) {
          return done(err);
        }

        if (!same) {
          return done(null, false, req.flash('loginMsg', 'Incorrect password!'));
        }

        return done(null, user);
      });
    });
  });
}));


// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});


// Deserialize user
passport.deserializeUser((req, id, done) => {
  User.getById(id, (err, user) => {
    done(err, user);
  });
});


module.exports = passport;