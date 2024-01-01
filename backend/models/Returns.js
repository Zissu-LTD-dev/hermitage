const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema({
  returnNum:{
    type: Number,
    default: 0
  },
  branchID: String,
  branchName: String,
  provider: Number || String,
  providerName: String,
  products: Array,
  totalOrders: Number,
  totalReturns: Number,
  totalPrice: Number,
  status: {
    type: String,
    default: 'pending'
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
    dateOnly: true
  }
})


module.exports = mongoose.model('Return', returnSchema)