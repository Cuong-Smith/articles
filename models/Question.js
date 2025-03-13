const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: { type: [String], required: true },
    keywords: { type: [String], default: [] },
    correctAnswerIndex: { type: Number, required: true },
    mainStatus: { type: String, default: "normal" }, // Mặc định là "normal"
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Question = mongoose.model('Question', QuestionSchema);
module.exports = { Question };
