const jwt = require("jsonwebtoken");


const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  // console.log({token: token});
  if (!token) return res.status(401).json({ msg: "You are not authorized you need login" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    // console.log({decoded: decoded});

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};

// authManager
const authManager = async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (!token) return res.status(401).json({ msg: "You are not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_MANAGER);
    // console.log({decoded: decoded});
    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};

const checkAuth = async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  const jwtSecret = req.headers.role == "admin" ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET_MANAGER;
  if (!token) return res.status(401).json({ msg: "You are not authorized please login" });

  try {
    const decoded = jwt.verify(token, jwtSecret );
    // console.log({decoded: decoded});
    req.user = decoded;
    res.status(200).json({ success: true, role: decoded.role });
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};


module.exports = { authAdmin, authManager, checkAuth };
