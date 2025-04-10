const express = require("express");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { User } = require('../config/db'); // Убедитесь, что путь к вашей модели пользователей правильный
const nodemailer = require('nodemailer'); // Для отправки email

const router = express.Router();

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Используйте ваш сервис
    auth: {
        user: process.env.EMAIL_USER, // Ваш email
        pass: process.env.EMAIL_PASSWORD, // Ваш пароль
    },
});

// Login Route
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля!" });
    }

    try {
        const user = await User.findOne({ where: {  email } });
        if (!user) {
            return res.status(401).json({ message: "Неверный email или пароль!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный email или пароль!" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Получаем IP-адрес и User-Agent
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        // Проверяем, является ли IP-адрес новым
        const isNewIpAddress = user.lastIpAddress !== ipAddress;

        if (isNewIpAddress) {
            // Отправляем email-уведомление
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Вход с нового устройства',
                text: `Вы вошли в свой аккаунт с нового IP-адреса: ${ipAddress}. Если это не вы, пожалуйста, измените пароль.`,
            };

            await transporter.sendMail(mailOptions);
        }

        // Обновляем последний IP-адрес пользователя
        await User.update({ lastIpAddress: ipAddress }, { where: { id: user.id } });

        return res.status(200).json({ message: "Вход выполнен успешно!", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера!" });
    }
});

module.exports.login_router = router;
