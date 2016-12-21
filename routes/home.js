'use strict'

const express = require('express');
const db = require('../db');


const router = express.Router();

router.get('/', (req, res, next) => {
  getAllPolls((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { title: 'Voting App', message: req.flash('logoutMsg'), polls: result });
  });
});


// Helpers
function getAllPolls(cb) {
  const collection = db.get().collection('polls');

  collection.find().toArray((err, result) => {
    cb(err, result);
  });
}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports = router;