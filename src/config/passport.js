const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        // check if there is a user with this email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: "This E-mail is not registered!",
          });
        }

        // check for correct password
        const correctPass = await bcrypt.compare(password, user.password);
        if (!correctPass) {
          return done(null, false, {
            message: "The password is incorrect",
          });
        }

        // return user
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
