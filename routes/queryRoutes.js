const express = require("express");
const {
  createQuery,
  updateQueryStatus,
  getQueries,
  getQuery,
  sendToInvestigation,
  approveQuery
} = require("../controllers/queryController");
const { authMiddleware, studentOnly, resolverOnly,investigationOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/CreateQuery", authMiddleware, studentOnly, upload.single("attachment"), createQuery); // Students
router.get("/getQueries", authMiddleware, getQueries); // Students and resolvers
router.patch("/updateQueryStatus/:id", authMiddleware, resolverOnly, updateQueryStatus); // Only resolvers
router.get("/getQuery/:id", authMiddleware, getQuery); 


router.post("/sendToInvestigation/:id", authMiddleware,resolverOnly, sendToInvestigation); // Only resolvers


router.put("/approveQuery/:id", authMiddleware,investigationOnly, approveQuery); 

module.exports = router;
