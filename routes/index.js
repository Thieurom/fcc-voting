'use strict'

module.exports = (app) => {
  // Store authenticated user to res's locals
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

  // Register routers to app
  app.use('/', require('./home'));
  app.use('/login', require('./login'));
  app.use('/logout', require('./logout'));
  app.use('/signup', require('./signup'));
  app.use('/profile', require('./profile'));
  app.use('/newpoll', require('./newpoll'));
  app.use('/poll', require('./poll'));
};