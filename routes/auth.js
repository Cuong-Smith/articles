const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();

// Đăng ký (Register)
router.post('/register', async (req, res) => {
    try {
        const { username, password, admin } = req.body;

        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên người dùng đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({ username, password: hashedPassword, admin: admin || false });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Error during registration:", error); // Ghi lại chi tiết lỗi
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Đăng nhập (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user trong database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Đăng nhập thành công!", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
