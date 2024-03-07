const auth = require("./authController.js");
const admin = require("./adminController.js");
const branch = require("./branchController.js");
const uploadFile = require("./uploadFile.js")
const upFilesToDB = require("./upFilesToDB.js");



module.exports = {
    auth,
    admin,
    branch,
    uploadFile,
    upFilesToDB
};
