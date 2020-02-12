const mongoose = require('mongoose');
const ImageSchema = require('./image');


const HistoryItemSchema = mongoose.Schema({
    title:{
        type: String,
        maxLength: 60,
        required: true    
    },
    date:{
        type: String,
        maxLength: 60,
        required: true
    },
    disease_id:{
        type: String, 
        maxLength: 20,
        required: true
    },
    confidence:{
        type: String, 
        maxLength: 20,
        required: true
    },
    pic:ImageSchema
    

});


const HistoryItem = mongoose.model('HistoryItem', HistoryItemSchema);

module.exports = HistoryItem;