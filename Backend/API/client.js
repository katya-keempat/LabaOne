
const express = require('express');
const client_router = express.Router();
const User = require('../config/db');

// Создание нового пользователя
client_router.post('/', async (req, res) => {
  const { name, email } = req.body;

  // Проверка обязательных полей
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    // Проверка уникальности email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Создание пользователя
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Получение списка всех пользователей
client_router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = client_router;