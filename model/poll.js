'use strict'

const db = require('../db');
const ObjectID = require('mongodb').ObjectID;


// Get all the polls
exports.all = (done) => {
  const collection = db.get().collection('polls');

  collection.find().sort({ _id: -1 }).toArray((err, result) => {
    done(err, result);
  });
};


// Get a specific poll by id
exports.getById = (pollID, done) => {
  const collection = db.get().collection('polls');

  collection.findOne({ _id: new ObjectID(pollID) }, (err, result) => {
    done(err, result);
  });
};


// Get all polls created by a specific creator
exports.getByCreator = (creatorID, done) => {
  const collection = db.get().collection('polls');

  collection.find({ creator: creator }, (err, result) => {
    done(err, result);
  });
}


// Vote a poll with an option by a registered user
exports.voteByRegisteredUser = (voter, pollID, pollOption, done) => {
  const collection = db.get().collection('polls');

  collection.updateOne({
    _id: new ObjectID(pollID), 'voters.registeredUser': { $nin: [voter] }, 'options.option': pollOption
  },
    { $inc: { 'options.$.vote': 1 }, $push: { 'voters.registeredUser': voter } }, (err, result) => {
      done(err, result.modifiedCount);
    });
};


// Vote a poll with an option by a anonymous user
exports.voteByAnonymous = (voter, pollID, pollOption, done) => {
  const collection = db.get().collection('polls');

  collection.updateOne({
    _id: new ObjectID(pollID), 'voters.anonymous': { $nin: [voter] }, 'options.option': pollOption
  },
    { $inc: { 'options.$.vote': 1 }, $push: { 'voters.anonymous': voter } }, (err, result) => {
      done(err, result.modifiedCount);
    });
};


// Delete an exist poll
exports.delete = (pollID, done) => {
  const collection = db.get().collection('polls');

  collection.deleteOne({ _id: new ObjectID(pollID) }, (err, result) => {
    done(err, result);
  });
};


