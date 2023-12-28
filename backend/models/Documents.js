const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now
    },
    link: String,
    forTo: {
        type: Array,
        default: ['all']
    }
});


module.exports = mongoose.model('Document', documentSchema)