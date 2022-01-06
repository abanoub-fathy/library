const express = require("express");
const author = require("../models/author");
const router = express.Router();
const Author = require("../models/author"); // author model
const Book = require("../models/book");

// authentication function
const auth = require("../config/auth");

// get all authors page
router.get("/", auth, async (req, res) => {
  const searchOptions = {};

  // check if we have search options or not
  if (req.query.name && req.query.name.trim() !== "") {
    let regex = new RegExp(req.query.name.trim(), "i");
    searchOptions.name = regex;
  }

  try {
    // fetch all authors related to the user in the database
    const authors = await Author.find({ user: req.user._id, ...searchOptions });
    res.render("authors/index", {
      authors,
      query: req.query.name,
    });
  } catch {
    res.redirect("/");
  }
});

// make new author page
router.get("/new", auth, (req, res) => {
  res.render("authors/new", {
    author: new Author(),
  });
});

// create new author handler
router.post("/", auth, async (req, res) => {
  const author = new Author({
    name: req.body.authorName,
    user: req.user._id,
  });
  try {
    await author.save();
    req.flash("success_msg", "New Author is added to your library");
    res.redirect("/authors");
  } catch (e) {
    console.log(e);
    res.render("authors/new", {
      errorMessage: "Cannot save this user to the database",
      author: {
        name: req.body.authorName,
      },
    });
  }
});

// show an author
router.get("/:id", auth, async (req, res) => {
  try {
    // find the author related to the user
    const author = await Author.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!author) {
      return res.redirect("/notfound");
    }

    // find the books of that author
    authorBooks = await Book.find({ author: author._id, user: req.user._id });

    res.render("authors/show", {
      author,
      authorBooks,
    });
  } catch {
    res.redirect("/notfound");
  }
});

// edit an author handler
router.get("/:id/edit", auth, async (req, res) => {
  try {
    const author = await Author.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    // if we have new author to edit
    if (!author) {
      return res.redirect("/notfound");
    }

    res.render("authors/edit", {
      author,
    });
  } catch (e) {
    res.redirect("/notfound");
  }
});

// update an author handler
router.patch("/:id", auth, async (req, res) => {
  const oldAuthor = { name: req.body.authorName, id: req.params.id };
  try {
    const author = await Author.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        name: req.body.authorName,
      },
      {
        runValidators: true,
      }
    );
    req.flash("success_msg", "Author is updated!");
    res.redirect(`/authors/${author._id}`);
  } catch {
    res.render("authors/edit", {
      author: oldAuthor,
      errorMessage: "Cannot update author",
    });
  }
});

// delete an author
router.delete("/:id", auth, async (req, res) => {
  try {
    const author = await Author.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!author) return res.redirect("notfound");

    await author.remove();
    req.flash("success_msg", "Author is removed successfully");
    res.redirect("/authors");
  } catch {
    res.render("authors/index", {
      errorMessage: "Cannot delete this author try again",
    });
  }
});

module.exports = router;
