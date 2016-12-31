'use strict'

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');


const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup', { title: 'Signup', pageFuncs: 'close-alert', message: req.flash('signupMsg') });
});


router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.register(username, password, (err, result) => {
    if (err) {
      return next(err);
    }

    if (result.value) {
      // given username already exists in database
      req.flash('signupMsg', username + ' is not available.');
      res.redirect('signup');
    } else {
      console.log('New user inserted to database!');
      res.redirect('login');
    }
  })
});


module.exports = router;