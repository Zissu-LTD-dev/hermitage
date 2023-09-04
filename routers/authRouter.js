const express = require("express");
const authRouter = express.Router();

const {
  login,
  addUser,
  updateUser,
  logout,
} = require("../controllers/authController.js");


authRouter.post("/login", login);
authRouter.post("/addUser", addUser);
authRouter.post("/updateUser", updateUser);
authRouter.post("/logout", logout);

exports.authRouter = authRouter;
