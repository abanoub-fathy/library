const mongoose = require("mongoose");
const baseUploadsPath = "uploads/covers";
const path = require("path");

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
    cover: {
      type: String,
      trim: true,
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
  if (book.cover) {
    return path.join("/", baseUploadsPath, book.cover);
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.baseUploadsPath = baseUploadsPath;
