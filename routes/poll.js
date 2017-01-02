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
        return res.render('poll', { className: 'poll', pageFuncs: 'vote share', poll: result });
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
  const operation = req.body.operation;
  const pollId = req.params.poll_id;

  if (operation === 'vote') {
    // Handle the voting poll operation
    let voter = '';
    const votedOption = req.body.option;

    if (req.isAuthenticated()) {
      voter = req.user.username;
      Poll.voteByRegisteredUser(voter, pollId, votedOption, updateHandler);
    } else {
      voter = req.headers['x-forwarded-for'];
      Poll.voteByAnonymous(voter, pollId, votedOption, updateHandler);
    }

  } else if (operation === 'edit') {
    // Handle the editing poll operation
    if (req.isAuthenticated()) {
      let newOptions = [];

      if (Array.isArray(req.body.option)) {
        newOptions = req.body.option.map((pollOption) => {
          return { option: pollOption, vote: 0 };
        });

      } else {
        newOptions.push({ option: req.body.option, vote: 0 });
      }

      Poll.addOptions(pollId, newOptions, updateHandler);
    } else {
      res.status(403).end();
    }
  }


  function updateHandler(err, result) {
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