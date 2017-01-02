'use strict'

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const path = require('path');
const passport = require('./config/passport');


const PORT = process.env.PORT || 3000;
const DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data-dev';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie_secret';

// App instance
const app = express();

// Database
const db = require('./db');

// Setup middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: false,
    maxAge: 4 * 60 * 60 * 1000,  // 4 hours
    store: new MongoStore({ url: DATABASE })
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
require('./routes')(app);

// Catch 404 error
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

app.use((err, req, res, next) => {
  if (req.xhr) {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status === 500) {
    res.render('error', { error: 'Internal Server Error' });
  } else {
    res.render('error', { error: err.message });
  }
});

// Connect to the database before establish server
db.connect(DATABASE, (error) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`);
  });
});