const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = userMiddleware;
