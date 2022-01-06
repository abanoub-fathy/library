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

module.exports = saveCoverImg;
