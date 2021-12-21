const express = require("express");
const multer = require("multer");
const router = express.Router();
const Book = require("../models/book"); // book model
const Author = require("../models/author"); // author model
const path = require("path");
const fs = require("fs");

// configure multer
const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];
const destPath = path.join("public", Book.baseUploadsPath);
const upload = multer({
  dest: destPath,
  limits: {
    fileSize: 2e6,
  },
  fileFilter(req, file, cb) {
    if (acceptedTypes.includes(file.mimetype)) {
      return cb(undefined, true);
    }
    // not accepted file type
    cb(Error(`${file.mimetype} is not accepted`));
  },
});

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
router.post("/", upload.single("cover"), async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author.trim(),
    description: req.body.description,
    pages: req.body.pages,
    publishDate: new Date(req.body.publishDate),
    cover: req.file ? req.file.filename : "",
  });

  try {
    await book.save();
    res.redirect("/books");
  } catch (e) {
    // if we have an error remove the cover of the book if exists
    if (book.cover) {
      removeBookCover(book.cover);
    }
    renderNewBookPage(res, book, true);
  }
});

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

// function to remove the book cover in the case of errors
const removeBookCover = (fileName) => {
  const pathOfTheCover = path.join(destPath, fileName);
  fs.unlink(pathOfTheCover, (err) => {
    if (err) console.error(err);
  });
};

module.exports = router;
