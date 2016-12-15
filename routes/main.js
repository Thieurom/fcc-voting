'use strict'

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  // Get the polls from database
  const db = req.db;
  const collection = db.collection('polls');

  collection.find().toArray((err, result) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    console.log(result);
    res.render('index', { title: 'Voting App' , polls: result });
  });
});

module.exports = router;