const express = require("express");
const {auth} = require("../controllers");
const  {checkAuth} = require('../middleware/auth.js')
const authRouter = express.Router();



authRouter.post("/login", auth.login);

authRouter.get("/verify", checkAuth);

authRouter.post("/addUser", auth.addUser); // move to adminRouter
// authRouter.put("/updateUser/:userId", auth.updateUser); // move to adminRouter
authRouter.post("/logout", auth.logout);

exports.authRouter = authRouter;
