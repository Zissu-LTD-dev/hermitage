const {
  Branches,
  Categories,
  Notifications,
  Obligations,
  Orders,
  Products,
  Providers,
  User,
} = require("../models");

// getProducts
const getProducts = async (req, res) => {
  const branchId = req.params.branchId;
  // Bring all products that a large or equal brunchtype 
  const products = await Products.find({
    branchType: {
      $gte: branchId,
    },
  });
  
  res.status(200).json({ 'success': true, 'products': products });
};

// addProduct
const addProduct = async (req, res) => {
  res.send("addProduct");
};

// updateProduct
const updateProduct = async (req, res) => {
  if(req.params.productId) return res.send(req.params.productId + " updateProduct");
  res.send("updateProduct");
};

// deleteProduct
const deleteProduct = async (req, res) => {
  if(req.params.productId) return res.send(req.params.productId + " deleteProduct");
  res.send("deleteProduct");
};


module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};