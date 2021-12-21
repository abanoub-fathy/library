const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// home page
router.get("/", async (req, res) => {
  try {
    const recentlyBooks = await Book.find()
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

module.exports = router;
