const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ msg: "You are not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    console.log({decoded: decoded});

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};

// authManager
const authManager = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ msg: "You are not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_MANAGER);
    console.log({decoded: decoded});
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};


module.exports = { authAdmin, authManager };
