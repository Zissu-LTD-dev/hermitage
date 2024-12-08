const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
  },
  name: String,
  phone: String,
  email: String,
  bookkeepingEmail: String,
  isBlocked: {
    type: Boolean,
    default: false,
  },
  branchEmails: [
    {
      branchID: String,
      branchNumber: Number,
      branchName: String,
      emails: Array,
    },
  ],
});

module.exports = mongoose.model("Provider", providerSchema);
