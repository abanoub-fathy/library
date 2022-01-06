const express = require("express");
const router = express.Router();
const Book = require("../models/book"); // book model
const Author = require("../models/author"); // author model
const saveCoverImg = require("./utils/save-cover-image");
const renderNewBookPage = require("./utils/render-new-book-page");

// authentication function
const auth = require("../config/auth");

// get all books page [GET] books/
router.get("/", auth, async (req, res) => {
  // make a query on the model book
  let query = Book.find({ user: req.user._id });

  // title
  if (req.query.title && req.query.title.trim !== "") {
    query = query.regex("title", new RegExp(req.query.title.trim(), "i"));
  }

  // publish before
  if (req.query.puplishBefore && req.query.puplishBefore !== null) {
    query = query.lte("publishDate", req.query.puplishBefore);
  }

  // publishs after
  if (req.query.puplishAfter && req.query.puplishAfter !== null) {
    query = query.gte("publishDate", req.query.puplishAfter);
  }

  try {
    const books = await query.exec();
    res.render("books/index", {
      books,
      searchQuery: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// make new book page
router.get("/new", auth, async (req, res) => {
  renderNewBookPage(req, res, new Book());
});

// create new book
// [POST] /books/
router.post("/", auth, async (req, res) => {
  const book = new Book({
    // spreaad the req object
    ...req.body,
    user: req.user._id,
  });

  // save cover image function
  saveCoverImg(book, req.body.cover);

  try {
    await book.save();
    req.flash("success_msg", "New Book is created successfully!");
    res.redirect("/books");
  } catch (e) {
    req.flash("Cannot create a new Book");
    renderNewBookPage(req, res, book, true);
  }
});

// show book page end point
router.get("/:id", auth, async (req, res) => {
  try {
    // fetch that book by id and poulate the author field
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id })
      .populate("author")
      .exec();

    // if we have no books
    if (!book) {
      return res.redirect("/notfound");
    }

    res.render("books/show", {
      book,
    });
  } catch (e) {
    res.redirect("/books");
    console.log(e);
  }
});

// edit book page end point
router.get("/:id/edit", auth, async (req, res) => {
  try {
    // fetch the book we need to edit
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    // if we hvae no book
    if (!book) {
      return res.redirect("/notfound");
    }

    const authors = await Author.find({ user: req.user._id });
    res.render("books/edit", {
      book,
      authors,
      errorMessage: null,
    });
  } catch {
    res.redirect("/books");
  }
});

// update book end point
router.patch("/:id", auth, async (req, res) => {
  try {
    // update the book we need to update
    let book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        ...req.body,
      },
      { runValidators: true }
    );

    // if we hvae no book
    if (!book) {
      return res.redirect("/notfound");
    }

    // save cover image function
    saveCoverImg(book, req.body.cover);

    // save changes after setting the cover image
    await book.save();

    // flash message
    req.flash("success_msg", "The book is Updated Correctly");
    res.redirect("/books");
  } catch {
    const authors = await Author.find({ user: req.user._id });
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    // if we hvae no book
    if (!book) {
      return res.redirect("/notfound");
    }
    res.render("books/edit", {
      book,
      authors,
      errorMessage: "cannot update this book!",
    });
  }
});

// delete book end point
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    if (!book) {
      return res.redirect("/notfound");
    }

    await book.remove();

    req.flash("success_msg", "Book is deleted Successfully!");
    res.redirect("/books");
  } catch (e) {
    console.log(e);
    req.flash("error_msg", "Error while deleting the book");
    res.redirect("/books");
  }
});

module.exports = router;
