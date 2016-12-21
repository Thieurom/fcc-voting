'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const Auth = require('../config/auth');

const router = express.Router();

router.get('/', Auth.isLoggedIn, (req, res, next) => {
  const collection = db.get().collection('polls');

  collection.find({ creator: req.user.username }, { poll: 1 }).sort({ _id: -1 }).toArray((err, result) => {
    if (err) {
      return next(err);
    }

    res.render('profile', { title: 'Voting App - Profile', polls: result });
  })
});

module.exports = router;