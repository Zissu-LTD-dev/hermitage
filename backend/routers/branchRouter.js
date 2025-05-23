const express = require("express");
const {branch, auth} = require("../controllers");
const branchRouter = express.Router();


// products
branchRouter.get("/getProducts", branch.getProducts);

// getCategory
branchRouter.get("/getCategory", branch.getCategory);

// getSubGroups
branchRouter.get("/getSubGroups", branch.getSubGroups);

// getFilters
branchRouter.get("/getFilters", branch.getFilters);

// createOrder
branchRouter.post("/createOrder", branch.createOrder);

// getOrders
branchRouter.get("/getOrders/:branchNumber", branch.getOrders);

// allDocuments
branchRouter.get("/allDocuments/:branchId", branch.allDocuments);

// downloadDocument
branchRouter.get("/downloadDocument/:documentId", branch.downloadDocument);

// getMessages
branchRouter.get("/getMessages/:branchId", branch.getMessages);

// getReadList
branchRouter.get("/getReadList/:branchId", branch.getReadList);

// readMessage
branchRouter.post("/readMessage", branch.readMessage);


exports.branchRouter = branchRouter;