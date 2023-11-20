const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: String,
    email: String, 
    password: String,
    role: String,
    branchId: {
      type: Number,
      ref: 'Branches'
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

// veryfy token = const isVerify = await User.verifyToken(token);
UserSchema.statics.verifyToken = function (token, secretKey) {
    return jwt.verify(token, secretKey)
}



module.exports = mongoose.model('User', UserSchema)