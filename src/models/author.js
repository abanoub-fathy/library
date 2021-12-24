const mongoose = require("mongoose");
const Book = require("./book");
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
});

authorSchema.pre("remove", async function (next) {
  const author = this;
  const autherBooks = await Book.find({ author: author._id });
  // remove author books
  if (autherBooks.length) {
    for (let i = 0; i < autherBooks.length; i++) {
      await autherBooks[i].remove();
    }
  }
});

module.exports = mongoose.model("Author", authorSchema);
