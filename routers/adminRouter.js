const express = require("express");
const adminRouter = express.Router();


adminRouter.get("/getUsers", (req, res) => {
    res.send("getUsers");
});


exports.adminRouter = adminRouter;