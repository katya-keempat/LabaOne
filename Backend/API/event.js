// routes/events.js
const express = require('express');
const event_router = express.Router();
const Event = require('../config/db');

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

module.exports = event_router;