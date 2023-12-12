const mongoose = require('mongoose')

const providerSchema = new mongoose.Schema({
    number: Number,
    name: String,
    phone: String,
    email: String,
    blocked: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Provider', providerSchema)