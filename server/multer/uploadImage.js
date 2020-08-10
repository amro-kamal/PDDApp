var express = require("express");
var Image = require("../models/image");
var ImageRouter = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};

const upload = multer({
  storage,
  filter: fileFilter
});

/* sh
    stores image in uploads folder
    using multer and creates a reference to the 
    file
*/
ImageRouter.post("/upload", upload.single("imageData"), (req, res, next) => {
  console.log(req.file);
  const newImage = new Image({
    imageName: req.file.filename,
    imageData: req.file.path
  });

  newImage
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        success: true,
        document: result
      });
    })
    .catch(err => next(err));
});

module.exports = upload;
