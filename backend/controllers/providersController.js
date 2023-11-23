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

// getProviders
const getProviders = async (req, res) => {
  res.send("getProviders");
};

// addProvider
const addProvider = async (req, res) => {
  res.send("addProvider");
};

// updateProvider
const updateProvider = async (req, res) => {
  if(req.params.providerId) return res.send(req.params.providerId + " updateProvider");
  res.send("updateProvider");
};

// deleteProvider
const deleteProvider = async (req, res) => {
  if(req.params.providerId) return res.send(req.params.providerId + " deleteProvider");
  res.send("deleteProvider");
};


module.exports = {
  getProviders,
  addProvider,
  updateProvider,
  deleteProvider,
};
