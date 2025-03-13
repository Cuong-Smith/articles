const jwt = require('jsonwebtoken');
const { Question } = require('../models/Question');

// Xác thực người dùng
function verifyUser(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Bạn cần đăng nhập!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ!" });

        req.user = decoded;
        next();
    });
}

// Kiểm tra Admin
function verifyAdmin(req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        res.status(403).json({ message: "Bạn không có quyền Admin!" });
    }
}

// Kiểm tra tác giả câu hỏi
async function verifyAuthor(req, res, next) {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) return res.status(404).json({ message: "Câu hỏi không tồn tại!" });

        if (question.author.toString() === req.user.id) {
            next();
        } else {
            res.status(403).json({ message: "Bạn không phải tác giả của câu hỏi này!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi server!" });
    }
}

module.exports = { verifyUser, verifyAdmin, verifyAuthor };
