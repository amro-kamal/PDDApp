const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    imageName:{
        type: String ,
        default: 'None'
    },
    imageData:{
        type: String,
    }
})


module.exports = ImageSchema;