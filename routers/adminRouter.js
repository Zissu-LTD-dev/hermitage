const express = require("express");
const adminRouter = express.Router();

// get all users
adminRouter.get("/getUsers", (req, res) => {
    res.send("getUsers");
});


exports.adminRouter = adminRouter;