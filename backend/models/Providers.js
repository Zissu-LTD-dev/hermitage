const mongoose = require('mongoose')

const providerSchema = new mongoose.Schema({
    number: Number,
    name: String,
    phone: String,
    email: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Provider', providerSchema)