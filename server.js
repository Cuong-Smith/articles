require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();

// Kết nối MongoDB
connectDB();

app.use(express.json());
// Sử dụng body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/questions', require('./routes/questions'));
app.use('/users', require('./routes/users'));

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
