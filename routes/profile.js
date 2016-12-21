'use strict'

const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
  const collection = db.get().collection('polls');

  collection.find({ creator: req.user.username }, { poll: 1 }).toArray((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('profile', { title: 'Voting App - Profile', polls: result });
  })
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}