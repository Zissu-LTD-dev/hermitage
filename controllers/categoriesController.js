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

// getCategories
const getCategories = async (req, res) => {
  console.log(req.params);
  res.send('all Products');
  
};

// addCategory
const addCategory = async (req, res) => {
  res.send("addCategory");
};

// updateCategory
const updateCategory = async (req, res) => {
  if(req.params.categoryId) return res.send(req.params.categoryId + " updateCategory");
  res.send("updateCategory");
};

// deleteCategory
const deleteCategory = async (req, res) => {
  if(req.params.categoryId) return res.send(req.params.categoryId + " deleteCategory");
  res.send("deleteCategory");
};


module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};