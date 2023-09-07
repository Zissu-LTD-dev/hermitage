const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter category name'],
        trim: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    subcategories: [this]
})

module.exports = mongoose.model('Category', categorySchema)
