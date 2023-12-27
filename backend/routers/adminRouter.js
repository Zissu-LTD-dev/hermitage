const express = require("express");
const {auth, admin, uploadFile } = require("../controllers");
const adminRouter = express.Router();

const multer = require('multer');
const multerUpload = multer({ dest: 'uploads/' });


// InitialData
adminRouter.get("/initialData", admin.initialData);

// updateBlockedProvidersByProvider
adminRouter.put("/updateBlockedProvidersByProvider", admin.updateBlockedProvidersByProvider);

// updateBlockedProvidersByBranch
adminRouter.put("/updateBlockedProvidersByBranch", admin.updateBlockedProvidersByBranch);

// updateBlockedProducts
adminRouter.put("/updateBlockedProducts", admin.updateBlockedProducts);

// /getOrders
adminRouter.get("/getAllOrders", admin.getAllOrders);

// updateOrder put
adminRouter.put("/updateOrder", admin.updateOrder);



// upload excel file
adminRouter.post("/upload", multerUpload.single('file'),  uploadFile.upload );

// upload pdf file
adminRouter.post("/uploadPdf", multerUpload.single('file'),  uploadFile.uploadPdf );


exports.adminRouter = adminRouter;