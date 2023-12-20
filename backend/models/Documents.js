const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    title: String,
    link: String,
    date: {
        type: Date,
        default: Date.now
    },
    status: String,
    Branch: {
        type: Number || String,
        default: 'All Branches'
    }
});


module.exports = mongoose.model('Document', documentSchema)