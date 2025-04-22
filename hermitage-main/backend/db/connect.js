const mongoose = require("mongoose");

const connectDB =  (uri) => {
    return mongoose.connect(uri, {
        dbName: process.env.DB_NAME,   
    })
}

module.exports = connectDB
