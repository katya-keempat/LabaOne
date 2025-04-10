const express = require("express");
require("dotenv").config;
const CORS = require("cors");
const http =  require("http");
const { swaggerDocs, swaggerUi } = require('./swagger');
const { sequelize } = require('./config/db');
const event_router = require('./API/event');
const User_router = require('./API/client');
const morgan = require('morgan');
const {passportconfig} = require("./config/passport");
const passport = require("passport");
const { auth_router } = require("./routes/auth");
const { login_router } = require("./routes/login");
const app = express();
const port = process.env.SERVERPORT|| 3000;
app.use(express.json());

passportconfig(passport);
app.use(passport.initialize())
app.use("/auth",auth_router);
// Настройка CORS
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
const allowedMethods = process.env.CORS_ALLOWED_METHODS?.split(',') || [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Разрешаем запрос
    } else {
      callback(new Error('Not allowed by CORS')); // Отклоняем запрос
    }
  },
  methods: allowedMethods, // Разрешённые HTTP-методы
};

app.use(CORS(corsOptions));
app.use(morgan('[HTTP] :method :url - :status (:response-time ms)'));
app.use("/event", event_router);
app.use("/user",User_router);
app.use("/login", login_router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Синхронизация базы данных и запуск приложения
async function auth(){
    try {
      // Проверка подключения к базе данных
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
  
      // Синхронизация моделей с базой данных
      await sequelize.sync({ force: true }); // Создание таблиц (force: true удаляет старые таблицы)
      console.log('Database & tables created!');
  
  
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});
const server= http.createServer(app);
server.listen(port,()=>{
    auth();  
    console.log("Server work!")
})
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Ошибка: Порт ${port} уже занят.`);
    } else {
        console.error(`Произошла ошибка: ${err.message}`);
    }
});
