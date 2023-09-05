const mongoose = require('mongoose')
const validator = require('validator')

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [20, 'Name cannot be more than 20 characters']   
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
        trim: true,
        maxlength: [50, 'Address cannot be more than 50 characters']
    },
    phone: {
        type: String,
        // required: [true, 'Please provide a phone number'],
        trim: true,
        maxlength: [20, 'Phone number cannot be more than 20 characters']
    },
    email: {
        type: String,
        // required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true,
        maxlength: [50, 'Email cannot be more than 50 characters']
    },
    type: {
        type: String,
        required: [true, 'Please provide a type'],
        enum: ['Beyond', 'hermitage', 'City', 'express'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Branch', BranchSchema)