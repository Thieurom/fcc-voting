'use strict'

const home = require('./home');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
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

  // Api
  app.use('/api', api);
};