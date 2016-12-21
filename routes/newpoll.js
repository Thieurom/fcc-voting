'use strict'

const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.render('newpoll', { title: 'Voting App - New poll'});
});

router.post('/', isLoggedIn, (req, res, next) => {
  const poll = req.body.poll;
  const options = {};

  req.body.option.forEach((option) => {
    options[option] = 0;
  });

  const collection = db.get().collection('polls');

  try {
    collection.insertOne({
      poll: poll,
      options: options,
      creator: req.user.username
    });

  } catch (error) {
    next(error);
  }

  res.redirect('/');
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}