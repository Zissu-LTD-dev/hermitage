const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    number: Number,
    branch: String,
    products: [{
      barcode: Number,
      quantity: Number,
      totalPrice: Number  
    }],
    totalPrice: Number,
    status: String,
    note: String
})

module.exports = mongoose.model('Order', orderSchema) 