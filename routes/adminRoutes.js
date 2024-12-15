const express = require('express');
const { getAllUsers, createUser, deleteUser } = require('../controllers/adminController');
const { authMiddleware,adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/getAllUsers', authMiddleware, adminOnly, getAllUsers);
router.post('/createUser', authMiddleware, adminOnly, createUser);
router.delete('/deleteUser/:userId', authMiddleware, adminOnly, deleteUser);



module.exports = router;
