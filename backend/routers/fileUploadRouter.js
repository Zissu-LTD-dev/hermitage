const express = require('express');
const fileUploadRouter = express.Router();
const multer = require('multer');
const uploads = process.env.UPLOADS_FOLDER;
// const path = require("path");
const {upFilesToDB} = require('../controllers');

const upload = multer({dest: uploads});

fileUploadRouter.get('/', (req, res) => {
    res.send('File upload...');
});

fileUploadRouter.post('/upload', upload.single('file'), upFilesToDB.mainUpload);



exports.fileUploadRouter = fileUploadRouter;