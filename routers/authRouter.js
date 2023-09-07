const express = require("express");
const {auth} = require("../controllers");
const authRouter = express.Router();



authRouter.post("/login", auth.login);
// authRouter.post("/addUser", auth.addUser); // move to adminRouter
// authRouter.post("/updateUser", auth.updateUser); // move to adminRouter
authRouter.post("/logout", auth.logout);

exports.authRouter = authRouter;
