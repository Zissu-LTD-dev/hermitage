const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Please enter product image'],
        trim: true,
    },
    sku: {
        type: String,
        required: [true, 'Please enter product sku'],
        trim: true,
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'inactive', 'inDestination'],
        default: 'active',
    },
})

module.exports = mongoose.model('Product', productSchema)