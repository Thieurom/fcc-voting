'use strict'

const express = require('express');


const router = express.Router();

router.get('/', (req, res) => {
  req.logout();
  req.flash('logoutMsg', 'You\'ve been logged out!');
  res.redirect('/');
});

module.exports = router;