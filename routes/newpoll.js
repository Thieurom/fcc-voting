'use strict'

const express = require('express');
const db = require('../db');
const Auth = require('../config/auth');


const router = express.Router();

router.get('/', Auth.isLoggedIn, (req, res) => {
  res.render('newpoll', { title: 'Voting App - New poll'});
});

router.post('/', Auth.isLoggedIn, (req, res, next) => {
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
    return next(error);
  }

  res.redirect('/');
});

module.exports = router;