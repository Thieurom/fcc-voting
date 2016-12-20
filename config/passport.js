'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;


const db = require('../db');

// Config strategy
passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  process.nextTick(() => {
    const collection = db.get().collection('users');

    collection.findOne({ username: username }, (err, user) => {
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
  console.log('deserializeUser');
  const collection = db.get().collection('users');

  collection.findOne({ _id: new ObjectID(id) }, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;