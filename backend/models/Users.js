const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: String, // encrypted
  role: {
    type: String,
    enum: ["manager", "subAdmin", "admin"],
  },
  branch: Number,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// update password
UserSchema.pre("updateOne", async function () {
  if (!this._update.password) return;
  const salt = await bcrypt.genSalt(10);
  this._update.password = await bcrypt.hash(this._update.password, salt);
});

// create jwt token
UserSchema.methods.createToken = function (secretKey, expiresIn) {
  return jwt.sign({ _id: this._id, role: this.role }, secretKey, { expiresIn });
};

// check password
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

// veryfy token = const isVerify = await User.verifyToken(token);
UserSchema.statics.verifyToken = function (token, secretKey) {
  return jwt.verify(token, secretKey);
};

module.exports = mongoose.model("User", UserSchema);
