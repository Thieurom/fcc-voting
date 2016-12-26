'use strict'

const express = require('express');
const Poll = require('../model/poll');


const router = express.Router();

router.get('/', (req, res, next) => {
  Poll.all((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { title: 'Voting App', message: req.flash('logoutMsg'), polls: result });
  });
});

module.exports = router;