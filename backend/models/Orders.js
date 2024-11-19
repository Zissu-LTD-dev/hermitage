const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  userName: String,
  branchEDI: String,
  branchNumber: Number,
  branchName: String,
  HP: Number,
  companyName: String,
  branchAddress: String,
  branchCity: String,
  branchMail: String,
  branchPhone: String,
  providerNumber: Number,
  providerName: String,
  orderLines: Object,
  returnLines: Object,
  totalOrderQty: Number,
  totalReturnQty: Number,
  totalOrderAmount: Number,
  totalReturnAmount: Number,
  orderStatus: {
    type: String,
    enum: ["pending", "approved", "canceled", ""],
  },
  returnStatus: {
    type: String,
    enum: ["pending", "approved", "canceled", ""],
  },
  noteProvider: String,
  noteManager: String,
  blockReason: String,
  createdDate: Date,
});

module.exports = mongoose.model("Order", orderSchema);
