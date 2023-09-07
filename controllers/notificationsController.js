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

// getNotifications
const getNotifications = async (req, res) => {
  if (req.params.branchId) return res.send(req.params.branchId + " getNotifications");
  res.send("getNotifications");
};

// updateNotification
const updateNotification = async (req, res) => {
  if (req.params.notificationId) return res.send(req.params.notificationId + " updateNotification");
  res.send("updateNotification");
};

// addNotification
const addNotification = async (req, res) => {
  res.send("addNotification");
};

// deleteNotification
const deleteNotification = async (req, res) => {
  if (req.params.notificationId) return res.send(req.params.notificationId + " deleteNotification");
  res.send("deleteNotification");
};


module.exports = {
  getNotifications,
  updateNotification,
  addNotification,
  deleteNotification,
};