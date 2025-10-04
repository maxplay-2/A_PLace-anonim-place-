// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.resolve("comments.json");

// Парсим JSON-тело
app.use(express.json());

// Отдаём статические файлы (index.html, css, js)
app.use(express.static("."));

// Создаём файл, если его нет
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, "[]", "utf-8");
}

// Получить комментарии
app.get("/api/comments", (req, res) => {
  const data = fs.readFileSync(COMMENTS_FILE, "utf-8");
  const comments = JSON.parse(data);
  res.json(comments);
});

// Добавить комментарий
app.post("/api/comments", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Комментарий пустой" });
  }

  const comment = {
    id: Date.now(),
    name: "Аноним",
    text: text.trim(),
    ts: new Date().toISOString(),
  };

  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8"));
  comments.unshift(comment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf-8");

  res.json(comment);
});

app.listen(PORT, () => console.log(`✅ Сервер запущен: http://localhost:${PORT}`));
