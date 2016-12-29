'use strict'

const express = require('express');
const db = require('../db');
const Auth = require('../config/auth');


const router = express.Router();

// Protected route
router.get('/', Auth.isLoggedIn, (req, res) => {
  res.render('newpoll', { title: 'New poll', pageFuncs: 'add-poll-option' });
});


// Protected route
router.post('/', Auth.isLoggedIn, (req, res, next) => {
  const question = req.body.question;
  const options = req.body.option.map((option) => {
    return { option: option, vote: 0 };
  });

  const collection = db.get().collection('polls');

  try {
    collection.insertOne({
      question: question,
      options: options,
      creator: req.user.username,
      voters: {
        registeredUser: [],
        anonymous: []
      }
    });

  } catch (error) {
    return next(error);
  }

  res.redirect('/');
});


module.exports = router;