const express = require("express");
const userRoutes = require("./userRoutes");
const queryRoutes = require("./queryRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/queries", queryRoutes);

module.exports = router;
