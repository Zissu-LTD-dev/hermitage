const express = require("express");
const {branch, auth} = require("../controllers");
const branchRouter = express.Router();


// products
branchRouter.get("/getProducts/:branchId", branch.getProducts);

// getFilters
branchRouter.get("/getFilters", branch.getFilters);

// createOrder
branchRouter.post("/createOrder", branch.createOrder);

// getOrders
branchRouter.get("/getOrders/:branchName", branch.getOrders);

// allDocuments
branchRouter.get("/allDocuments/:branchId", branch.allDocuments);

// downloadDocument
branchRouter.get("/downloadDocument/:documentId", branch.downloadDocument);


exports.branchRouter = branchRouter;