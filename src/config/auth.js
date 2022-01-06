const auth = (req, res, next) => {
  // if the user is authenticated
  if (req.isAuthenticated()) return next();

  // if not authenticated
  req.flash("error", "You should be authenticated to see this resource");
  res.redirect("/users/login");
};

module.exports = auth;
