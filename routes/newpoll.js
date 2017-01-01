'use strict'

const express = require('express');
const Poll = require('../model/poll');
const Auth = require('../config/auth');


const router = express.Router();

// Protected route
router.get('/', Auth.isLoggedIn, (req, res) => {
  res.render('newpoll', { title: 'New poll', className: 'poll', pageFuncs: 'add-option' });
});


// Protected route
router.post('/', Auth.isLoggedIn, (req, res, next) => {
  const question = req.body.question;
  const options = req.body.option.map((option) => {
    return { option: option, vote: 0 };
  });

  Poll.new(question, options, req.user.username, (err, result) => {
    if (err) {
      return next(err);
    }

    res.redirect('/');
  });
});


module.exports = router;