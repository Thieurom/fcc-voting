'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const Poll = require('../model/poll');
const Auth = require('../config/auth');

const router = express.Router();

// Protected route
router.get('/', Auth.isLoggedIn, (req, res, next) => {
  Poll.getByCreator(req.user.username, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('profile', { title: 'Profile', className: 'poll', pageFuncs: 'add-option delete edit', polls: result });
  })
});

module.exports = router;