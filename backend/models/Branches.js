const mongoose = require('mongoose')
const validator = require('validator')

const branchSchema = new mongoose.Schema({
    name: String,
    city: String,
    type: String,
    typeNumber: Number,
    blockedProviders: Array,
})

module.exports = mongoose.model('Branch', branchSchema)