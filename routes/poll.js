'use strict'

const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const Auth = require('../config/auth');


const router = express.Router();

router.get('/:poll_id', (req, res, next) => {
  const collection = db.get().collection('polls');

  collection.findOne({ _id: new ObjectID(req.params.poll_id) }, (err, result) => {
    if (err) {
      return next(err);
    }

    if (result) {
      if (req.xhr || req.accepts('html', 'json') === 'json') {
        return res.json(result);
      } else {
        return res.render('poll', { poll: result });
      }
    }
  });
});

router.delete('/:poll_id', Auth.isLoggedIn, (req, res, next) => {
  const collection = db.get().collection('polls');

  try {
    collection.deleteOne({ _id: new ObjectID(req.params.poll_id) });
  } catch (error) {
    return next(error);
  }

  res.status(204).end();
});

router.put('/:poll_id', (req, res, next) => {
  const collection = db.get().collection('polls');

  try {
    collection.updateOne({ _id: new ObjectID(req.params.poll_id), 'options.option': req.body.option },
      { $inc: { 'options.$.vote': 1, 'votes': 1 } });
  } catch (error) {
    return next(error);
  }

  res.status(204).end();
});


module.exports = router;