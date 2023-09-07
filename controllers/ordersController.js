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

// getOrders
const getOrders = async (req, res) => {
  if (req.params.branchId) return res.send(req.params.branchId + " getOrders");
  res.send("getOrders");
};

// updateOrder
const updateOrder = async (req, res) => {
  if (req.params.orderId) return res.send(req.params.orderId + " updateOrder");
  res.send("updateOrder");
};

// createOrder
const createOrder = async (req, res) => {
  res.send("createOrder");
};


module.exports = {
  getOrders,
  updateOrder,
  createOrder,
};