const express = require("express");
const router = express.Router();
const Book = require("../models/book"); // book model
const Author = require("../models/author"); // author model

// get all books page [GET] books/
router.get("/", async (req, res) => {
  // make a query on the model book
  let query = Book.find();

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
router.get("/new", async (req, res) => {
  renderNewBookPage(res, new Book());
});

// create new book
// [POST] /books/
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author.trim(),
    description: req.body.description,
    pages: req.body.pages,
    publishDate: new Date(req.body.publishDate),
  });

  // save cover image function
  saveCoverImg(book, req.body.cover);

  try {
    await book.save();
    res.redirect("/books");
  } catch (e) {
    renderNewBookPage(res, book, true);
  }
});

// function to save the cover of the book if exists
const saveCoverImg = (book, fileReq) => {
  // if there is no req for saving image
  if (!fileReq) {
    return;
  }

  // destructure the type and the data
  const { type, data } = JSON.parse(fileReq);

  // define accepted types
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];

  // check for valid file type
  if (type && acceptedTypes.includes(type)) {
    book.imgType = type;
    book.coverImg = Buffer.from(data, "base64");
  }
};

// function to render the new Book Page --> /books/new
const renderNewBookPage = async (res, book, hasError = false) => {
  try {
    // fetch all authors
    const authors = await Author.find();
    res.render("books/new", {
      book,
      authors: authors,
      error: hasError ? "Cannot Create the book" : "",
    });
  } catch {
    res.redirect("/books");
  }
};

module.exports = router;
