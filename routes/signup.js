'use strict'

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');


const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup', { title: 'Voting App - Signup'});
});

router.post('/', (req, res, next) => {
  let username = req.body.username;

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    try {
      // check the given username is existed on database or not
      // if not, create new user and save to database
      const collection = db.get().collection('users');

      collection.findOneAndUpdate(
        
        { username: username },
        { $setOnInsert:
          {
            username: username,
            passwordHash: hash
          }
        },
        {
          returnNewDocument: false,
          upsert: true
        }, (err, doc) => {
          if (err) {
            return next(err);
          }

          if (doc.value) {
            // given username already exists in database
            res.redirect('signup');
          } else {
            console.log('New user inserted to database!');
            res.redirect('login');
          }
        });
      
    } catch (error) {
      next(error);
    }
  });
});

module.exports = router;