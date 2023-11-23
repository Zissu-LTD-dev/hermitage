const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderNum: {
      type: Number,
      default: 0
    },
    branchID: String,
    branchName: String,
    provider: String,
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

module.exports = mongoose.model('Order', orderSchema) 