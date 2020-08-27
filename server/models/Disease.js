const mongoose = require("mongoose");

const DiseaseSchema = mongoose.Schema({
  disease_id: {
    type: String,
    maxLength: 20,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    maxLength: 60,
    required: true,
  },
  category: {
    type: String,
    maxLength: 60,
    required: true,
  },
  summary: {
    type: String,
    maxLength: 400,
    required: true,
  },
  symptoms: {
    type: String,
    maxLength: 400,
    required: true,
  },
  treatment: {
    type: String,
    maxLength: 400,
    required: true,
  },
  imageUrl: {
    type: Array,
    maxLength: 60,
    required: true,
  },
});

const Disease = mongoose.model("Disease", DiseaseSchema);

module.exports = Disease;
