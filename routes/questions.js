const express = require('express');
const { verifyUser, verifyAdmin, verifyAuthor } = require('../middleware/authenticate');
const  { Question }  = require('../models/Question');

const router = express.Router();

// Lấy danh sách câu hỏi (ai cũng xem được)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
        process.exit(1);
    }
    
});

// Thêm câu hỏi (Chỉ Admin)
router.post('/', verifyUser, verifyAdmin, async (req, res) => {
    const { text, options, correctAnswerIndex, keywords } = req.body;
    const newQuestion = new Question({ text, options, correctAnswerIndex, keywords, author: req.user.id });
    await newQuestion.save();
    res.json(newQuestion);
});

// Sửa câu hỏi (Chỉ tác giả)
router.put('/:questionId', verifyUser, verifyAuthor, async (req, res) => {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
    res.json(updatedQuestion);
});

// Xóa câu hỏi (Chỉ tác giả)
router.delete('/:questionId', verifyUser, verifyAuthor, async (req, res) => {
    await Question.findByIdAndDelete(req.params.questionId);
    res.json({ message: "Câu hỏi đã bị xóa!" });
});

module.exports = router;
