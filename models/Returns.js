const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema({
    branch: String,
    products: [{
      barcode: Number,
      quantity: Number,
      reason: String
    }],
    status: String
})


module.exports = mongoose.model('Return', returnSchema)