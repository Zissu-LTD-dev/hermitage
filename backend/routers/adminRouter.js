const express = require("express");
const {auth, admin, uploadFile } = require("../controllers");
const adminRouter = express.Router();

const multer = require('multer');
const path = require("path");

const storagePDF = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "../assets/documents"));
    },
    // filename with utf-8
    filename:  function(req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + "-" + file.originalname);
        }
        
  });

  const storageXLSX = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "../assets/documents"));
    },
    // filename with utf-8
    filename:  function(req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + "-" + file.originalname);
        }
        
  });

const uploadPDF = multer({storage: storagePDF});

const uploadXLSX = multer({storage: storageXLSX});


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
adminRouter.post("/upload", uploadXLSX.single('file'),  uploadFile.upload );

// upload pdf file
adminRouter.post("/uploadPdf", uploadPDF.single('pdfFile'),  uploadFile.uploadPdf );


exports.adminRouter = adminRouter;