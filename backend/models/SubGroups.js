const mongoose = require('mongoose');

const subGroupSchema = new mongoose.Schema({
    number: {
        type: Number,
        unique: true
    },
    name: String
})

module.exports = mongoose.model('SubGroup', subGroupSchema)