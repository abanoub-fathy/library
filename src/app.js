require("./db/mongoose"); // for connecting to the database
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const router = require("./routers/router");
const authorRouter = require("./routers/author");
const booksRouter = require("./routers/book");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use("/", router);
app.use(methodOverride("_method"));

// Routers should be loaded after all configs
app.use("/authors", authorRouter);
app.use("/books", booksRouter);

module.exports = app;
