const {User, Branch} = require("../models");
const weezmoMail = require("../functions/weezmoMail");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

const addUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const user = await User.create(req.body);

  res.status(201).json({ user });
};

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Please provide username and password" });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ error: "The email is incorrect" });

  const isMatch = await user.checkPassword(password);
  if (!isMatch)
    return res.status(404).json({ error: " The password is incorrect " });

  let token = "";
  let expiresIn = remember ? '30d' : process.env.JWT_EXPIRE ;
  if (user.role == "admin" || user.role == "subAdmin" || user.role == "master") {
    token = user.createToken(process.env.JWT_SECRET_ADMIN, expiresIn );
  } else if (user.role === "manager") {
    token = user.createToken(process.env.JWT_SECRET_MANAGER, expiresIn );
  }
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
  
  user.password = undefined;
  user.createdAt = undefined;

  
  let branch = await Branch.findOne({ number: user.branch });

  

  res.status(200).json({ user: user , branch, token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Please provide email" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const resetToken = user.createResetPasswordToken();
  const userUpdate = await user.updateOne({
    password: resetToken,
  });
  
  if (!userUpdate) return res.status(500).json({ error: "Server error" });

  const sendMail = await weezmoMail.forgetPassword(email, resetToken);

  if (!sendMail) return res.status(500).json({ error: true,  msg: "Server error in sending email" });

  res.status(200).json({ msg: "Email sent successfully" , success: true });
}

const updateUser = async (req, res) => {
  let { userId } = req.params;
  const { username, password, email, role } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) return res.status(404).json({ msg: "User not found" });

  user.username = username ? username : user.username;
  user.password = password ? password : user.password;
  user.email = email ? email : user.email;
  user.role = role ? role : user.role;

  await user.save();

  res.status(200).json({ msg: "User updated successfully" });
};

const logout = async (req, res) => {
  res.clearCookie("jwt").status(200).json({ msg: "logout successful !!!" });
  // res.status(200).json({ msg: "logout successful !!!" });
};

module.exports = { getUsers, login, forgotPassword, addUser, updateUser, logout };
