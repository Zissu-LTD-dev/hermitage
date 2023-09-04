const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        maxlength: [20, 'Username cannot be more than 20 characters']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true,
        maxlength: [50, 'Email cannot be more than 50 characters']
    },
    role: {
        type: String,
        required: [true, 'Please provide a role'],
        enum: ['admin', 'branch manager', 'Bookkeeping'],
        default: 'branch manager'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

// create jwt token
UserSchema.methods.createToken = function (secretKey) {
    return jwt.sign({ _id: this._id , role: this.role }, secretKey , { expiresIn: process.env.JWT_EXPIRE })
}

// check password
UserSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.password)
    return result
}



module.exports = mongoose.model('User', UserSchema)
