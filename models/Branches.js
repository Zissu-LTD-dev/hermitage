const mongoose = require('mongoose')
const validator = require('validator')

const branchSchema = new mongoose.Schema({
    name: String,
    address: String,
    storeIds: [Number], 
    type: {
      type: Number,
      ref: 'BranchType'
    }
})

module.exports = mongoose.model('Branch', branchSchema)