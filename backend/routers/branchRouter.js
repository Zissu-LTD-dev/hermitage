const express = require("express");
const {categories, notifications, orders, returns, products, providers, filters, auth} = require("../controllers");
const branchRouter = express.Router();

branchRouter.get("/test", (req, res) => {
    // let user = req.user;
    res.send({"test branch": "user"});
});



// products
// -- get all products for this branch
branchRouter.get("/getProducts/:branchId", products.getProducts);

// createOrder
// -- create order
branchRouter.post("/createOrder", orders.createOrder);

// getOrders
// -- get all orders for this branch
branchRouter.get("/getOrders/:branchName", orders.getOrders);

// getFilters
// -- get all filters from provider end ctegories
branchRouter.get("/getFilters", filters.getFilters);





// categories
// -- get all categories for this branch
branchRouter.get("/getCategories/:branchId", categories.getCategories);

// providers
// -- get all providers 
branchRouter.get("/getProviders", providers.getProviders);

// return
// -- get all returns for this branch
branchRouter.get("/getReturns/:branchId", returns.getReturns);
// -- create return
branchRouter.post("/createReturn", returns.createReturn);

// notifications
// -- get all notifications for this branch
branchRouter.get("/getNotifications/:branchId", notifications.getNotifications);





exports.branchRouter = branchRouter;