// routes/events.js
const express = require('express');
const event_router = express.Router();
const {Event} = require('../config/db');
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для управления мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получение списка всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает список мероприятий.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Получение списка всех мероприятий
event_router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получение одного мероприятия по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает мероприятие.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Получение одного мероприятия по ID
event_router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создание нового мероприятия
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время проведения мероприятия
 *             required:
 *               - title
 *               - date
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Некорректные данные в запросе
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Создание мероприятия
event_router.post('/', async (req, res) => {
  const { title, description, date } = req.body;

  // Проверка обязательных полей
  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  try {
    const event = await Event.create({ title, description, date });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновление мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Новое название мероприятия
 *               description:
 *                 type: string
 *                 description: Новое описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Новая дата и время проведения мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Обновление мероприятия
event_router.put('/:id', async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Обновление полей
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удаление мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
// Удаление мероприятия
event_router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID мероприятия
 *         title:
 *           type: string
 *           description: Название мероприятия
 *         description:
 *           type: string
 *           description: Описание мероприятия
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата и время проведения мероприятия
 *       example:
 *         id: 1
 *         title: "Конференция по технологиям"
 *         description: "Ежегодная конференция для разработчиков"
 *         date: "2023-12-15T10:00:00Z"
 */
module.exports = event_router;