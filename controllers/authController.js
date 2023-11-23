const {User} = require("../models");
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
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Please provide username and password" });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ error: "The email is incorrect" });

  const isMatch = await user.checkPassword(password);
  if (!isMatch)
    return res.status(404).json({ error: " The password is incorrect " });

  let token = "";
  if (user.role === "admin") {
    token = user.createToken(process.env.JWT_SECRET_ADMIN);
  } else if (user.role === "branch manager") {
    token = user.createToken(process.env.JWT_SECRET_MANAGER);
  }
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
  
  user.password = undefined;
  user.createdAt = undefined;


  res.status(200).json({ user: user , token });
};

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

module.exports = { getUsers, login, addUser, updateUser, logout };
