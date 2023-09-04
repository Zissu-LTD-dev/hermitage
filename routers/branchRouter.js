const express = require("express");
const branchRouter = express.Router();

branchRouter.get("/getBranches", (req, res) => {
    res.send("getBranches");
});


exports.branchRouter = branchRouter;