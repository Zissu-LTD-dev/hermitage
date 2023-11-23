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

// getObligations
const getObligations = async (req, res) => {
  if (req.params.branchId) return res.send(req.params.branchId + " getObligations");
  res.send("getObligations");
};

// updateObligations
const updateObligations = async (req, res) => {
  if (req.params.branchId) return res.send(req.params.branchId + " updateObligations");
  res.send("updateObligations");
};


module.exports = {
  getObligations,
  updateObligations,
};