'use strict'

const home = require('./home');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const profile = require('./profile');
const newpoll = require('./newpoll');
const api = require('./api');


module.exports = (app) => {
  // Store authenticated user to res's locals
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

  // Homepage
  app.use('/', home);

  // Login
  app.use('/login', login);

  // Logout
  app.use('/logout', logout);

  // Signup
  app.use('/signup', signup);

  // profile
  app.use('/profile', profile);

  // New poll
  app.use('/newpoll', newpoll);

  // Api
  app.use('/api', api);
};