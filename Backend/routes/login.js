const express = require("express");
require("dotenv").config;
const CORS = require("cors");
const http =  require("http");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {User} = require('../config/db');

const router = express.Router();
// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля!" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Неверный email или пароль!" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный email или пароль!" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        return res.status(200).json({ message: "Вход выполнен успешно!", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера!" });
    }
});

module.exports.login_router = router;