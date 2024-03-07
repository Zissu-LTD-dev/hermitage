const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
  },
  name: String,
  phone: String,
  email: String,
  isBlocked: {
    type: Boolean,
    default: false,
  },
  branchEmails: [
    {
      branchNumber: Number,
      branchName: String,
      emails: Array,
    },
  ],
});

module.exports = mongoose.model("Provider", providerSchema);
