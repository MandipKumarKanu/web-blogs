const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // console.log(req);
    const { role } = req.user;

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

module.exports = roleMiddleware;
