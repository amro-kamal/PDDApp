const mongoose = require("mongoose");
const HistoryItem = require("./HistoryItem");

const UserSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    maxLength: 60,
    required: true,
  },
  email: {
    type: String,
    maxLength: 60,
    required: true,
    match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  },
  password: {
    type: String,
    maxLength: 300,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  history: {
    type: [],
    maxLength: 10,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
