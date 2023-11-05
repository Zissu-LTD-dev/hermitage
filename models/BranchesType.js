const mongoose = require('mongoose')

const branchTypeSchema = new mongoose.Schema({
    typeId: {
        type: Number, 
        enum: [1,2,3,4]
      },
      name: String,
      color: String
})

module.exports = mongoose.model('BranchType', branchTypeSchema)