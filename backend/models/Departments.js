const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    number: Number,
    name: String
})

module.exports = mongoose.model('Department', departmentSchema)