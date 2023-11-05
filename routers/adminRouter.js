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

// obligations
// -- get summery obligations for all branches
adminRouter.get("/getObligations", obligations.getObligations);
// -- get summery obligations for specific branch
adminRouter.get("/getObligations/:branchId", obligations.getObligations);
// -- update obligations for specific branch
adminRouter.put("/updateObligations/:branchId", obligations.updateObligations);

// users
//  -- get all users
adminRouter.get("/getUsers", auth.getUsers);
// -- add user
adminRouter.post("/addUser", auth.addUser);
// -- update user
adminRouter.put("/updateUser/:userId", auth.updateUser);

// branches
// -- get all branches
adminRouter.get("/getBranches", branches.getBranches);
// -- add branch
adminRouter.post("/addBranch", branches.addBranch);
// -- update branch
adminRouter.put("/updateBranch/:branchId", branches.updateBranch);

// orders
// -- get all orders
adminRouter.get("/getOrders", orders.getOrders);
// -- get orders for specific branch
adminRouter.get("/getOrders/:branchId", orders.getOrders);
// -- update status order 
adminRouter.put("/updateOrder/:orderId", orders.updateOrder);

// notifications
// -- get all notifications
adminRouter.get("/getNotifications", notifications.getNotifications);
// -- get notifications for specific branch
adminRouter.get("/getNotifications/:branchId", notifications.getNotifications);
// -- update status notification
adminRouter.put("/updateNotification/:notificationId", notifications.updateNotification);
// -- add notification
adminRouter.post("/addNotification", notifications.addNotification);
// -- delete notification
adminRouter.delete("/deleteNotification/:notificationId", notifications.deleteNotification);

// products 
// -- get all products
adminRouter.get("/getProducts", products.getProducts);
// -- add product
adminRouter.post("/addProduct", products.addProduct);
// -- update product
adminRouter.put("/updateProduct/:productId", products.updateProduct);
// -- delete product
adminRouter.delete("/deleteProduct/:productId", products.deleteProduct);

// providers
// -- get all providers
adminRouter.get("/getProviders", providers.getProviders);
// -- add provider
adminRouter.post("/addProvider", providers.addProvider);
// -- update provider
adminRouter.put("/updateProvider/:providerId", providers.updateProvider);
// -- delete provider
adminRouter.delete("/deleteProvider/:providerId", providers.deleteProvider);

// categories
// -- get all categories
adminRouter.get("/getCategories", categories.getCategories);
// -- add category
adminRouter.post("/addCategory", categories.addCategory);
// -- update category
adminRouter.put("/updateCategory/:categoryId", categories.updateCategory);
// -- delete category
adminRouter.delete("/deleteCategory/:categoryId", categories.deleteCategory);


exports.adminRouter = adminRouter;