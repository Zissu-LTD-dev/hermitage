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
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_MANAGER);
    } catch (managerError) {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      } catch (adminError) {
        throw new Error('Token verification failed');
      }
    }
    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
};

const checkAuth = async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  console.log(req.headers);
  let role = req.headers.role; 
  let isAdmin = role == "admin" || role == "subAdmin" || role == "master";
  console.log({isAdmin: isAdmin});
  
  const jwtSecret = isAdmin ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET_MANAGER;
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
