'use strict'

// Deps
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data-dev';

// Routers
const main = require('./routes/main');

// Database object
let db;

// App instance
const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Make database accessible to routers
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/', main);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { error: err.message });
});


MongoClient.connect(DATABASE, (error, database) => {
  if (error) {
    return console.log(error);
  }

  db = database;

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`);
  });
});