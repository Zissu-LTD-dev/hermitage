const {
  Branches,
  Categories,
  Notifications,
  Obligations,
  Orders,
  Returns,
  Products,
  Providers,
  User,
} = require("../models");

// get all returns
const getReturns = async (req, res) => {
  if(req.params.branchId) return res.send(req.params.branchId + " returns");
  res.send("all returns");
};

// create return
const createReturn = async (req, res) => {
  res.send("create return");
}

module.exports = {
  getReturns,
  createReturn
};
