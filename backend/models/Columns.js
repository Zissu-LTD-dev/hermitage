const mongoose = require('mongoose')

const columnSchema = new mongoose.Schema({
    number: Number,
    name: String
})

module.exports = mongoose.model('Column', columnSchema)