'use strict'

const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
  const collection = db.get().collection('polls');

  collection.find({ username: req.user.username }).toArray((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { title: 'Voting App', user: req.user, polls: result });
  })
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}