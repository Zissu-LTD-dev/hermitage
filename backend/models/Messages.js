const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: String,
  branch_ids: Array,
  sender: String,
  timestamp: Date,
});

module.exports = mongoose.model("Message", messageSchema);
