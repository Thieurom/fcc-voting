'use strict'

const express = require('express');
const Auth = require('../config/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { title: 'Login', pageFuncs: 'close-alert', message: req.flash('loginMsg') });
});


router.post('/', Auth.login('/', '/login'));


module.exports = router;