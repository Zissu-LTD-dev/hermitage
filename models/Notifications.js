const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    toBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        default: "all branches"
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);


