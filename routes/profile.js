'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const Poll = require('../model/poll');
const Auth = require('../config/auth');

const router = express.Router();

// Protect route
router.get('/', Auth.isLoggedIn, (req, res, next) => {
  Poll.getByCreator(req.user.username, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('profile', { title: 'Profile', pageFuncs: 'add-poll-option delete-poll edit-poll', polls: result });
  })
});

module.exports = router;