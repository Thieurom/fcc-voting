'use strict'

const express = require('express');
const Auth = require('../config/auth');


const router = express.Router();

// Protected route
router.get('/', Auth.isLoggedIn, (req, res) => {
  req.logout();
  req.flash('logoutMsg', 'You\'ve been logged out!');
  res.redirect('/');
});


module.exports = router;