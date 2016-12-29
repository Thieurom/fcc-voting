'use strict'

const express = require('express');
const Poll = require('../model/poll');


const router =  express.Router();

router.get('/:user_id', (req, res, next) => {
  Poll.getByCreator(req.params.user_id, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { pageFuncs: 'get-poll-chart', polls: result });
  });
});

module.exports = router;