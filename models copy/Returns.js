const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema({
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
    reason: {
        type: String,
        required: [true, 'Please provide a reason'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Please provide a status'],
        enum: ['Pending', 'Confirmed', 'Canceled'],
        default: 'Pending',
    }
}, { timestamps: true });


module.exports = mongoose.model('Return', returnSchema)