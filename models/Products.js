const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    barcode: {
      type: Number,
      unique: true
    },
    name: String,
    image: String,
    provider: {
      type: Number,
      ref: 'Providers'
    },
    department: {
      type: Number,
      ref: 'Department'
    },
    category: {
      type: Number, 
      ref: 'Category'
    },
    columnNumber: Number,
    columnName: String,
    row: [{
        branch: {
          type: Number,
          ref: 'BranchType'
        },
        number: Number
    }],
    branchType: { 
      type: Number,
      ref: 'BranchType'
    }
})



module.exports = mongoose.model('Product', ProductSchema)