const Author = require("../../models/author");

// function to render the new Book Page --> /books/new
const renderNewBookPage = async (req, res, book, hasError = false) => {
  try {
    // fetch all authors related to the user
    const authors = await Author.find({ user: req.user._id });
    res.render("books/new", {
      book,
      authors,
      errorMessage: hasError ? "Cannot Create the book" : "",
    });
  } catch (e) {
    console.log(e);
    res.redirect("/notfound");
  }
};

module.exports = renderNewBookPage;
