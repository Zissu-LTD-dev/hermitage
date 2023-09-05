const mongoose = require('mongoose')
const validator = require('validator')

// write schema for Providers - name, phone, email, status = blocked / active, createdAt, updatedAt

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['blocked', 'active'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

module.exports = mongoose.model('Provider', providerSchema)
