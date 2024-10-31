const mongoose = require("mongoose");

const messageReadsSchema = new mongoose.Schema({
    message_id: mongoose.Schema.Types.ObjectId,
    branch_id: mongoose.Schema.Types.ObjectId,
    read_timestamp: Date
});

module.exports = mongoose.model("MessageReads", messageReadsSchema);