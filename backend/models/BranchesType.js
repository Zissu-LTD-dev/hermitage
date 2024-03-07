const mongoose = require("mongoose");

const branchTypeSchema = new mongoose.Schema({
  typeId: {
    type: Number,
    unique: true,
  },
  name: String,
  color: String,
});

module.exports = mongoose.model("BranchType", branchTypeSchema);
