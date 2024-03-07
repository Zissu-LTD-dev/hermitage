const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  barcode: {
    type: Number,
    unique: true
  },
  name: String,
  image: String,  
  providerNumber: Number,
  providerName: String, 
  subGroupNumber: Number, 
  subGroupName: String,  
  packQuantity: Number,
  price: Number,
  branchTypeConfig: [{ 
    branchType: Number,
    location: {
      category: Number,
      column: Number,
      shelf: Number,
      index: Number  
    }
  }], 
  isBlocked: {
    type: Boolean,
    default: false
  }
});



module.exports = mongoose.model('Product', ProductSchema)