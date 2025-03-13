const express = require('express');
const { verifyUser, verifyAdmin } = require('../middleware/authenticate');
const { User } = require('../models/User');

const router = express.Router();

// Lấy danh sách người dùng (Chỉ Admin)
router.get('/', verifyUser, verifyAdmin, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
