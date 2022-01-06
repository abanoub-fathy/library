require("./db/mongoose"); // for connecting to the database
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// passport config
require("./config/passport")(passport);

// important paths
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

// config express server
const app = express();

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.set("layout", "layouts/layout");
app.use(express.static(publicPath));
app.use(expressLayouts);

// bodyparser
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// method override
app.use(methodOverride("_method"));

// passport Initialize
app.use(passport.initialize());
app.use(passport.session());

// Flash Msgs
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routers should be loaded after all configs
app.use("/authors", require("./routers/author"));
app.use("/books", require("./routers/book"));
app.use("/users", require("./routers/user"));
app.use("/", require("./routers/index"));

module.exports = app;
