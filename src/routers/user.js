const express = require("express");
const User = require("../models/user");
const auth = require("../config/auth");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// define router
const router = express.Router();

// render with errors function
const renderWithErrors = require("./utils/render-with-errors");

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// create new user handler
// register handler
router.post("/register", async (req, res) => {
  // array of errors
  let errors = [];
  // destructure our fields
  const { name, email, password, password2 } = req.body;

  // validate the required fields
  if (!name.trim() || !email.trim() || !password || !password2) {
    errors.push({ msg: "You should fill all the required fields" });
  }

  // validate the password chars
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 chars" });
  }

  // validate the passwords matching
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // if we have an error
  if (errors.length) {
    return renderWithErrors(res, "register", errors, req.body);
  }

  // if validation passed
  // check if the user is existed in the database
  const user = await User.findOne({ email });
  if (user) {
    errors.push({ msg: `This E-mail ${email} is already used before` });
    return renderWithErrors(res, "register", errors, req.body);
  }

  // if the user is not existed to the database create new user
  const newUser = new User({
    name,
    email,
    password: await bcrypt.hash(password, 8),
  });
  // save the user to the database
  await newUser.save();

  req.flash("success_msg", "You are registered and can login");
  res.redirect("/users/login");
});

// login handler
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/library",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// logout handler
router.get("/logout", auth, (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
