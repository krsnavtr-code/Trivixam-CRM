const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate({
      path: "role",
      select: "name displayName permissions level",
    });
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

const authorize = (...roleNames) => {
  return (req, res, next) => {
    if (!req.user.role || !roleNames.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role?.name || "undefined"} is not authorized to access this route`,
      });
    }
    next();
  };
};

const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.role || !req.user.role.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `User does not have required permission: ${permission}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize, authorizePermission };
