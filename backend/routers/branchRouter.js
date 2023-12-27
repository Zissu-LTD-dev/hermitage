const express = require("express");
const {branch, auth} = require("../controllers");
const branchRouter = express.Router();


// products
// -- get all products for this branch
branchRouter.get("/getProducts/:branchId", branch.getProducts);

// getFilters
// -- get all filters from provider end ctegories
branchRouter.get("/getFilters", branch.getFilters);

// createOrder
// -- create order
branchRouter.post("/createOrder", branch.createOrder);

// getOrders
// -- get all orders for this branch
branchRouter.get("/getOrders/:branchName", branch.getOrders);


exports.branchRouter = branchRouter;