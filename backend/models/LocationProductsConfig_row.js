const mongoose = require('mongoose');

const locationProductsConfigSchema = new mongoose.Schema({
    categoryNumber: Number,
    categoryName: String,
    columnsNumber: Number,
    columnsName: String,
    shelvesNumber: String || Number,
    shelvesName: String,
    branchType1: String,
    branchType2: String,
    branchType3: String,
    branchType4: String,
    branchType5: String,
    branchType6: String,  
  })

module.exports = mongoose.model('LocationProductsConfig_row', locationProductsConfigSchema)