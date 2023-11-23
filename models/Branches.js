const mongoose = require('mongoose')
const validator = require('validator')

const branchSchema = new mongoose.Schema({
    name: String,
    city: String,
    type: String,
    typeNumber: Number,
})

module.exports = mongoose.model('Branch', branchSchema)