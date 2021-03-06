'use strict'

const express = require('express');
const Auth = require('../config/auth');
const Utils = require('../config/utils');
const User = require('../model/user');


const router = express.Router();

router.get('/', Auth.isLoggedIn, (req, res) => {
  res.render('setting', { title: 'Settings', className: 'user-action', pageFuncs: 'update-password', message: req.flash('settingMsg') });
});


router.post('/', Auth.isLoggedIn, (req, res, next) => {
  const user = req.user;
  const currentPassword = req.body.password,
    newPassword = req.body.newPassword;

  Utils.validatePassword(currentPassword, req.user.passwordHash, (err, same) => {
    if (err) {
      return next(err);
    }

    if (!same) {
      req.flash('homeMsg', 'Incorrect current password! Login and try again!');
      req.logout();
      return res.redirect('/');
    }

    Utils.makePasswordHash(newPassword, (err, hash) => {
      if (err) {
        return next(err);
      }

      User.saveNewPassword(user, hash, (error, result) => {
        if (error) {
          return next(error);
        }

        req.flash('loginMsg', 'You\'ve updated your password. Please login with new one!');
        req.logout();
        res.redirect('/login');
      })
    })
  })
})


module.exports = router;