const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: [true, 'Please provide an order number'],
        trim: true,        
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'Please provide a branch'],
    },
    provider: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Please provide a provider'],
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide a product'],
    }],
    quantity: {
        type: Number,
        required: [true, 'Please provide a quantity'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Please provide a status'],
        enum: ['Pending', 'Confirmed', 'Canceled'],
        default: 'Pending',
    },
    notes: {
        type: String,
        trim: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
