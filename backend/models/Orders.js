const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  branchNumber: Number,
  branchName: String,
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
  notes: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
