const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
  
  },
  name: String,
  icon: String,
});

module.exports = mongoose.model("Category", categorySchema);
