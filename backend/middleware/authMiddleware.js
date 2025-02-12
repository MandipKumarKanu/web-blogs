const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  //   console.log(req);
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // console.log({ token });
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) return res.status(403).json({ message: err.message });
  //   // console.log(decoded);
  //   req.user = decoded.user;
  //   next();
  // });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    // console.log(user)
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;
