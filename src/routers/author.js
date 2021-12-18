const express = require("express");
const router = express.Router();
const Author = require("../models/author"); // author model

// get all authors page
router.get("/", async (req, res) => {
  const searchOptions = {};

  // check if we have search options or not
  if (req.query.name && req.query.name.trim() !== "") {
    let regex = new RegExp(req.query.name.trim(), "i");
    searchOptions.name = regex;
  }

  try {
    // fetch all authors in the database
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors,
      query: req.query.name,
    });
  } catch {
    res.redirect("/");
  }
});

// make new author page
router.get("/new", (req, res) => {
  res.render("authors/new", {
    author: {
      name: "",
    },
  });
});

// create new user
router.post("/", async (req, res) => {
  const author = new Author({ name: req.body.authorName });
  try {
    await author.save();
    res.redirect("/authors");
  } catch {
    res.render("authors/new", {
      errorMessage: "Cannot save this user to the database",
      author: {
        name: req.body.authorName,
      },
    });
  }
});

module.exports = router;
