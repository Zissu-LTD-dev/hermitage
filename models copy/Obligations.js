const mongoose = require('mongoose')
const validator = require('validator')

const obligationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Obligation', obligationSchema)
