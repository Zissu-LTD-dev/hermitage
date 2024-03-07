const mongoose = require('mongoose');

const locationProductsConfigSchema = new mongoose.Schema({
    categoryNumber: {
        type: Number,
        unique: true,
    },
    categoryName: String,  
    columns: [{
      columnNumber: Number,
      columnName: String,
      shelves: [{
        branchTypeNumber: Number,
        Details: [{
          branchTypeOpened: {
            type: Boolean,
            default: false
          },
          shelfNumber: Number,
          shelfName: String     
        }]
      }]
    }]
})

module.exports = mongoose.model('LocationProductsConfig', locationProductsConfigSchema)