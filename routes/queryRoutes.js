const express = require("express");
const {
  createQuery,
  updateQueryStatus,
  getQueries,
  getQuery
} = require("../controllers/queryController");
const { authMiddleware, studentOnly, resolverOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/CreateQuery", authMiddleware, studentOnly, upload.single("attachment"), createQuery); // Only students
router.get("/getQueries", authMiddleware, getQueries); // Students and resolvers
router.patch("/updateQueryStatus/:id", authMiddleware, resolverOnly, updateQueryStatus); // Only resolvers
router.get("/getQuery/:id", authMiddleware, getQuery); 

module.exports = router;
