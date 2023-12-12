const auth = require("./authController.js");

const admin = require("./adminController.js");

const branches = require("./branchesController.js");
const categories = require("./categoriesController.js");
const notifications = require("./notificationsController.js");
const obligations = require("./obligationsController.js");
const orders = require("./ordersController.js");
const returns = require("./returnController.js");
const products = require("./productsController.js");
const providers = require("./providersController.js");
const uploadFile = require("./uploadFile.js")
const filters = require("./filtersController.js");



module.exports = {
    auth,
    admin,
    branches,
    categories,
    notifications,
    obligations,
    orders,
    returns,
    products,
    providers,
    uploadFile,
    filters
};
