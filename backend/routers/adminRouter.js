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

// get all documents
adminRouter.get("/allDocuments", admin.getAllDocuments);

// download document
adminRouter.get("/downloadDocument/:id", admin.downloadDocument);

// updateDocument
adminRouter.put("/updateDocument/:id", admin.updateDocument);

// delete document
adminRouter.delete("/deleteDocument/:id", admin.deleteDocument);

// add product
adminRouter.post("/addProduct", admin.addProduct); 

// edit product
adminRouter.put("/editProduct/:id", admin.editProduct);

// delete product
adminRouter.delete("/deleteProduct/:id", admin.deleteProduct);


// add branch
adminRouter.post("/newBranch", admin.newBranch);

// edit branch
adminRouter.put("/editBranch/:id", admin.editBranch);

// get all users
adminRouter.get("/allUsers", admin.allUsers);

// add user
adminRouter.post("/addUser", admin.addUser);

// edit user
adminRouter.put("/editUser/:id", admin.editUser);

// add provider
adminRouter.post("/addProvider", admin.addProvider);


// upload excel file
adminRouter.post("/uploadExcel", uploadXLSX.single('excelFile'),  uploadFile.uploadExcel );

// upload pdf file
adminRouter.post("/uploadPdf", uploadPDF.single('pdfFile'),  uploadFile.uploadPdf );


exports.adminRouter = adminRouter;