const express = require("express");
const {auth, admin, branches, categories, notifications, obligations, orders, products, providers, uploadFile } = require("../controllers");
const adminRouter = express.Router();

const multer = require('multer');
const multerUpload = multer({ dest: 'uploads/' });

adminRouter.get("/test", (req, res)=>{
    console.log(req.body);
    res.status(200).json({message: "test"});
});

// InitialData
adminRouter.get("/initialData", admin.initialData);

// updateBlockedProvidersByProvider
adminRouter.put("/updateBlockedProvidersByProvider", admin.updateBlockedProvidersByProvider);

// updateBlockedProvidersByBranch
adminRouter.put("/updateBlockedProvidersByBranch", admin.updateBlockedProvidersByBranch);



// upload excel file
adminRouter.post("/upload", multerUpload.single('file'),  uploadFile.upload );

// /getOrders
adminRouter.get("/getAllOrders", orders.getAllOrders);

// updateOrder put
adminRouter.put("/updateOrder", orders.updateOrder);

// get all providers
adminRouter.get("/getProviders", providers.getProviders);



exports.adminRouter = adminRouter;