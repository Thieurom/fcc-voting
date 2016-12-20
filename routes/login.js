'use strict'

const express = require('express');
const passport = require('../config/passport');


const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { title: 'Voting App - Login', message: req.flash('loginMsg') });
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;