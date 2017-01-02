'use strict'

const express = require('express');
const Poll = require('../model/poll');


const router = express.Router();

router.get('/', (req, res, next) => {
  Poll.all((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { className: 'poll', pageFuncs: 'show-chart', message: req.flash('homeMsg'), polls: result });
  });
});

module.exports = router;