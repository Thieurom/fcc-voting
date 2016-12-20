'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');


const router = express.Router();

router.get('/poll/:poll_id', (req, res) => {
  const collection = db.get().collection('polls');

  collection.findOne({ _id: new ObjectID(req.params.poll_id) }, { _id: 0 }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    if (result) {
      return res.json(result);
    }

    return res.json({});
  });
});

module.exports = router;