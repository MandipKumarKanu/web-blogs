const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //   console.log(req);
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

    // console.log({ token });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: err.message });
    // console.log(decoded);
    req.user = decoded.user;
    next();
  });
};

module.exports = authMiddleware;
