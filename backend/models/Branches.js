const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
  },
  name: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  branchTypeNumber: Number,
  branchTypeName: String,
  blockedProviders: Array,
});

module.exports = mongoose.model("Branch", branchSchema);
