const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    number: Number,
    name: String  
})

module.exports = mongoose.model('Category', categorySchema)