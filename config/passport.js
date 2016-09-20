const LocalStrategy = require('passport-local').Strategy;

// user model
const Users = require('../app/models/user');

module.exports = (passport) => {
  // passport session setup
  // ======================
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // localstrategy login

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    if (email) email.toLowerCase();

    process.nextTick(() => {
      Users.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'Nombre de usuario no válido.'));
        }

        user.validatePassword(password, (err, res) => {
          if (err) { return done(err); }

          if (!res) { return done(null, false, req.flash('loginMessage', `La contraseña que has introducido para ${user.email} es incorrecta.`)); }

          return done(null, user);
        });
      });
    });
  }));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    if (email) email = email.toLowerCase();

    process.nextTick(() => {
      Users.findOne({ email }, (err, user) => {
        if (err) return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'El email esta en uso.'));
        } else {
          Users.create({ name: req.body.name, email: email, password: password, role: req.body.role }, (err, newUser) => {
            if (err) return done(err);

            return done(null, newUser);
          });


        }
      })
    });
  }));
};
