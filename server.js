'use strict'

// Deps
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Routes
const main = require('./routes/main');

// App instance
const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  res.status(err.status);
  res.render('404', { error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} ...`);
});