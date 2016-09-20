const express = require('express');
const passport = require('passport');
const Users = require('../models/user');

const router = express.Router();

router.route('/')
      .get((req, res) => {
        //if (req.isAuthenticated()) {
          res.render('home', { title: 'Panel de control', isAdmin: true, user: req.user});
        /*} else {
          Users.findOne({}, (err, user) => {
            if (user) {
              res.redirect('/login');
            } else {
              res.render('install', { title: 'Instalacion de Invoicetron', message: req.flash('signupMessage') });
            }
          });
        }*/
      });

router.route('/install')
      .post(passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      }));

module.exports = router;
