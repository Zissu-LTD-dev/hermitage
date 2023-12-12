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
    providerName: String,
    department: {
      type: Number,
      ref: 'Department'
    },
    departmentName: String,
    category: {
      type: Number, 
      ref: 'Category'
    },
    categoryName: String,
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
    },
    blocked: {
      type: Boolean,
      default: false
    },
})



module.exports = mongoose.model('Product', ProductSchema)