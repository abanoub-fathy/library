const mongoose = require("mongoose");
const dummyBook = require("./dummy-book.js");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImg: {
      type: Buffer,
    },
    imgType: {
      type: String,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create virtual property imgPath

bookSchema.virtual("imgPath").get(function () {
  const book = this;
  if (book.coverImg) {
    return `data:${book.imgType};base64,${book.coverImg.toString("base64")}`;
  } else {
    return `data:image/jpeg;base64,${dummyBook}`;
  }
});

module.exports = mongoose.model("Book", bookSchema);
