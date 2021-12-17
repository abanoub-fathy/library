require("./db/mongoose"); // for connecting to the database
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const router = require("./routers/router");

// important paths
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

// config express server
const app = express();
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.set("layout", "layouts/layout");
app.use(express.static(publicPath));
app.use(expressLayouts);
app.use(router);

module.exports = app;
