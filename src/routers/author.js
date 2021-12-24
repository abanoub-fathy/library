const express = require("express");
const author = require("../models/author");
const router = express.Router();
const Author = require("../models/author"); // author model
const Book = require("../models/book");

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
    author: new Author(),
  });
});

// create new author
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

// show an author
router.get("/:id", async (req, res) => {
  try {
    // find the author
    const author = await Author.findById(req.params.id);

    // find the books of that author
    authorBooks = await Book.find({ author: author._id });

    res.render("authors/show", {
      author,
      authorBooks,
    });
  } catch {
    res.redirect("/");
  }
});

// edit an author
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", {
      author,
    });
  } catch {
    res.redirect("/authors");
  }
});

// update an author
router.patch("/:id", async (req, res) => {
  const oldAuthor = { name: req.body.authorName, id: req.params.id };
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.authorName,
      },
      {
        runValidators: true,
      }
    );
    res.redirect(`/authors/${author._id}`);
  } catch {
    res.render("authors/edit", {
      author: oldAuthor,
      errorMessage: "Cannot update author",
    });
  }
});

// delete an author
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch {
    res.render("authors/index", {
      errorMessage: "Cannot delete this author try again",
    });
  }
});

module.exports = router;
