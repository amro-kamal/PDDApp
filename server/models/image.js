// const mongoose = require('mongoose');

// const ImageSchema = mongoose.Schema({
//     imageName:{
//         type: String ,
//         default: 'None'
//     },
//     imageData:{
//         type: String,
//     }
// })

// module.exports = ImageSchema;

const mongoose = require("mongoose");
const { ObjectId, Int32, Binary } = require("mongodb");

const ImageSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  contentType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  img: {
    type: Object,
    required: true,
  },
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
