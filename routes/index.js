'use strict'

const home = require('./home');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const profile = require('./profile');
const api = require('./api');


module.exports = (app) => {
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

  // Api
  app.use('/api', api);
};