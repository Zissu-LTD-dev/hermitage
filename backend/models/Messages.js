const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  status: String,
  Branch: {
    type: Array,
    default: ["all"],
  },
});

module.exports = mongoose.model("Message", messageSchema);
