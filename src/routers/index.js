const express = require("express");
const auth = require("../config/auth");

const router = express.Router();
const Book = require("../models/book");

// Welcome Page
router.get("/", (req, res) => {
  res.render("welcome");
});

// library router
router.get("/library", auth, async (req, res) => {
  try {
    const recentlyBooks = await Book.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
    res.render("index", {
      recentlyBooks,
    });
  } catch {
    res.render("index", {
      recentlyBooks: [],
    });
  }
});

// not found page
router.get("*", auth, (req, res) => {
  res.render("not-found");
});

module.exports = router;
