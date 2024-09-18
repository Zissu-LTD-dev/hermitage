const mongoose = require('mongoose');

const locationProductsConfigSchema = new mongoose.Schema({
    categoryNumber: Number,
    categoryName: String,
    columnsNumber: Number,
    columnsName: String,
    shelvesNumber: String || Number,
    shelvesName: String, 
  })

module.exports = mongoose.model('LocationProductsConfig_row', locationProductsConfigSchema)