'use strict'

const express = require('express');
const Poll = require('../model/poll');
const Auth = require('../config/auth');


const router = express.Router();

router.get('/:poll_id', (req, res, next) => {
  Poll.getById(req.params.poll_id, (err, result) => {
    if (err) {
      return next(err);
    }

    if (result) {
      if (req.xhr || req.accepts('html', 'json') === 'json') {
        return res.json(result);
      } else {
        return res.render('poll', { pageFuncs: 'vote-poll', poll: result });
      }
    }
  });
});


// Protected route
router.delete('/:poll_id', Auth.isLoggedIn, (req, res, next) => {
  Poll.delete(req.params.poll_id, (err, result) => {
    if (err) {
      return next(err);
    }

    res.status(204).end();
  })
});


router.put('/:poll_id', (req, res, next) => {
  let voter;
  const pollId = req.params.poll_id,
    option = req.body.option;

  if (req.isAuthenticated()) {
    voter = req.user.username;
    Poll.voteByRegisteredUser(voter, pollId, option, responseVoting);
  } else {
    voter = req.headers['x-forwarded-for'];
    Poll.voteByAnonymous(voter, pollId, option, responseVoting);
  }


  function responseVoting(err, result) {
    if (err) {
      return next(err);
    }

    if (!result) {
      res.status(403).end();
    } else {
      res.status(204).end();
    }
  }
});


module.exports = router;