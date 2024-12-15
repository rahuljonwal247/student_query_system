const express = require("express");
const userRoutes = require("./userRoutes");
const queryRoutes = require("./queryRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/queries", queryRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
