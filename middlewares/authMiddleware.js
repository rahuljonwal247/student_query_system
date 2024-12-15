// const jwt = require("jsonwebtoken");
// const { User } = require("../models");

// exports.authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(decoded.id);
//     if (!user) return res.status(401).json({ error: "Unauthorized" });

//     req.user = user; // Attach user to request
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// exports.studentOnly = (req, res, next) => {
//   if (req.user.role !== "student") {
//     return res.status(403).json({ error: "Access restricted to students" });
//   }
//   next();
// };

// exports.resolverOnly = (req, res, next) => {
//   if (req.user.role !== "resolver") {
//     return res.status(403).json({ error: "Access restricted to resolvers" });
//   }
//   next();
// };



const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Access restricted to students" });
  }
  next();
};

exports.resolverOnly = (req, res, next) => {
  if (req.user.role !== "resolver") {
    return res.status(403).json({ error: "Access restricted to resolvers" });
  }
  next();
};
exports.investigationOnly = (req, res, next) => {
  if (req.user.role !== "investigator") {
    return res.status(403).json({ error: "Access restricted to investigators" });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access restricted to investigators" });
  }
  next();
};