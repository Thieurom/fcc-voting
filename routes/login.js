'use strict'

const express = require('express');
const Auth = require('../config/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { title: 'Voting App - Login', message: req.flash('successFlash') });
});

router.post('/', Auth.login('/', '/login'));

module.exports = router;