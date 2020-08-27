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
  files_id: {
    type: ObjectId,
    required: true,
  },
  n: {},
  data: {},
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
