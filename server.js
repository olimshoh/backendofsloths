// server.js
require("dotenv").config(); // Загружаем переменные окружения из .env
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Feedback = require("./Feedback"); // Импортируем модель

const app = express();
const PORT = 5000;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Подключено к MongoDB"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

// Middleware
app.use(cors()); // Включаем CORS
app.use(bodyParser.json()); // Обрабатываем JSON-данные

// Обработка POST-запроса
app.post("/", async (req, res) => {
  const { username, text } = req.body; // Получаем текст и имя пользователя из тела запроса

  // Создаем новый объект Feedback
  const feedback = new Feedback({ username, text });

  try {
    // Сохраняем данные в базе данных
    await feedback.save();
    console.log("Полученные данные:", { username, text });

    // Отправляем ответ клиенту
    res.json({ message: "Ваши впечатления успешно отправлены!" });
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    res.status(500).json({ message: "Ошибка при сохранении данных" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
