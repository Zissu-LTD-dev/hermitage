const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  barcode: {
    type: Number,
    unique: true
  },
  name: String,
  image: Boolean,
  providerNumber: Number,
  providerName: String, 
  subGroupNumber: Number, 
  subGroupName: String,  
  packQuantity: Number,
  category: Number,
  price: Number,
  branchTypeConfig: [{ 
    branchType: Number,
    QuantityLimit : {
      type: Number,
      default: 0
    },
    location: {
      column: Number,
      shelf: Number,
      index: Number  
    }
  }], 
  isBlocked: {
    type: Boolean,
    default: false
  },
});



module.exports = mongoose.model('Product', ProductSchema)