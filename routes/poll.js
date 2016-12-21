'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const Auth = require('../config/auth');


const router = express.Router();

router.get('/:poll_id', (req, res, next) => {
  const collection = db.get().collection('polls');

  collection.findOne({ _id: new ObjectID(req.params.poll_id) }, { _id: 0 }, (err, result) => {
    if (err) {
      next(err);
    }

    if (result) {
      if (req.accepts('application/json')) {
        return res.json(result);
      }
      
      // TODO: render result as html here
    }
  });
});

router.delete('/:poll_id', Auth.isLoggedIn, (req, res, next) => {
  const collection = db.get().collection('polls');

  try {
    collection.deleteOne({ _id: new ObjectID(req.params.poll_id) });
  } catch(error) {
    return next(error);
  }

  res.status(204).end();
});


module.exports = router;