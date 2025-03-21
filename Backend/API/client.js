const express = require('express');
const User_router = express.Router();
const {User} = require('../config/db');
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /User:
 *   post:
 *     summary: Создание нового пользователя
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Некорректные данные в запросе (отсутствуют обязательные поля)
 *       409:
 *         description: Email уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Создание нового пользователя
User_router.post('/', async (req, res) => {
  const { name, email } = req.body;

  // Проверка обязательных полей
  if (!name && !email) {
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
/**
 * @swagger
 * /User:
 *   get:
 *     summary: Получение списка всех пользователей
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает список пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Получение списка всех пользователей
User_router.get('/', async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /User/delete-filter:
 *   get:
 *     summary: Получение списка пользователей без мягкого удаления
 *     tags: [User]
 *     description: Возвращает список пользователей, которые не были мягко удалены
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает список активных пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
User_router.get('/delete-filter', async (req, res) => {
  try {
    const user = await User.findAll({
      where: { deletedAt: null }, // Sequelize автоматически добавляет этот фильтр
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /User/{id}:
 *   delete:
 *     summary: Мягкое удаление пользователя
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Пользователь успешно удален (мягкое удаление)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
User_router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Мягкое удаление
    await user.destroy();
    res.status(204).send(); // Возвращаем статус 204 (No Content)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = User_router;
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           description: Email пользователя
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания пользователя
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата обновления пользователя
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Дата мягкого удаления пользователя (если удалён)
 *       example:
 *         id: 1
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         createdAt: "2023-10-01T12:00:00Z"
 *         updatedAt: "2023-10-01T12:00:00Z"
 *         deletedAt: null
 */