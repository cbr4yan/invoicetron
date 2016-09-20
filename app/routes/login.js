const express = require('express');
const passport = require('passport');

const router = express.Router();

router.route('/')
      .get((req, res) => {
        if (req.isAuthenticated()) {
          res.redirect('/');
        } else {
          const message = req.flash('loginMessage');
          const isMessage = message.length > 0 ? true : false;
          res.render('login', { title: 'Login', message: message, isMessage: isMessage });
        }
      })
      .post(passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }));

module.exports = router;
