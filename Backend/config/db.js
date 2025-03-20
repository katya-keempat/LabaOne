require('dotenv').config();
const { Client } = require('pg');
const { Sequelize, DataTypes } = require('sequelize');
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const port = process.env.DB_PORT
const dataname = process.env.DB_NAME
const sequelize = new Sequelize(`postgres://${username}:${password}@${host}:${port}/${dataname}`, {
  dialect: 'postgres',
});
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  timestamps: false, // Отключаем автоматические поля updatedAt
});
// Модель Event
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Связываем с моделью User
      key: 'id',   // Поле id в модели User
    },
  },
}, {
  timestamps: false, // Отключаем автоматические поля updatedAt
});
User.hasMany(Event, { foreignKey: 'createdBy' }); // Один пользователь может создать много мероприятий
Event.belongsTo(User, { foreignKey: 'createdBy' }); // Каждое мероприятие принадлежит одному пользователю
module.exports = sequelize;
module.exports = Client;
module.exports = Event;