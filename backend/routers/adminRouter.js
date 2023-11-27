const express = require("express");
const {auth, branches, categories, notifications, obligations, orders, products, providers, uploadFile } = require("../controllers");
const adminRouter = express.Router();

const multer = require('multer');
const multerUpload = multer({ dest: 'uploads/' });

adminRouter.get("/test", (req, res)=>{
    console.log(req.body);
    res.send("test");
});

// upload excel file
adminRouter.post("/upload", multerUpload.single('file'),  uploadFile.upload );

// /getOrders
adminRouter.get("/getAllOrders", orders.getAllOrders);


exports.adminRouter = adminRouter;