'use strict'

const db = require('../db');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');


// Create new user into database
exports.register = (username, password, done) => {
  const collection = db.get().collection('users');

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    // check the given username is existed on database or not
    // if not, create new user and save to database
    collection.findOneAndUpdate(
      { username: username },
      {
        $setOnInsert:
        {
          username: username,
          passwordHash: hash
        }
      },
      {
        returnNewDocument: false,
        upsert: true
      }, (err, result) => {
        done(err, result);
      });
  });
};


// Get user by id
exports.getById = (id, done) => {
  const collection = db.get().collection('users');

  collection.findOne({ _id: new ObjectID(id) }, (err, user) => {
    done(err, user);
  });
};


// Get user by username
exports.getByName = (name, done) => {
  const collection = db.get().collection('users');

  collection.findOne({ username: name }, (err, user) => {
    done(err, user);
  });
};