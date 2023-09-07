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

// getBranches
const getBranches = async (req, res) => {
  res.send("getBranches");
};

// addBranch
const addBranch = async (req, res) => {
  res.send("addBranch");
};

// updateBranch
const updateBranch = async (req, res) => {
  res.send("updateBranch");
};


module.exports = {
  getBranches,
  addBranch,
  updateBranch,
};