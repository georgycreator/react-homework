const { randomUUID } = require('node:crypto');
const { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');
const cors = require('cors');
const express = require('express');
const seed = require('./seed.json');

const STATUSES = new Set(['todo', 'doing', 'done']);
const MAX_TITLE_LENGTH = 120;
const MAX_USER_ID_LENGTH = 64;
const dataFile = resolve(process.env.DATA_FILE || join(__dirname, '../data/db.json'));
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || defaultOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function assertDatabase(candidate, sourceName) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new Error(`${sourceName}: корень файла должен быть объектом.`);
  }
  if (!Array.isArray(candidate.users) || candidate.users.length < 4 || !Array.isArray(candidate.tasks)) {
    throw new Error(`${sourceName}: ожидаются массивы users (минимум 4 участника) и tasks.`);
  }

  const userIds = new Set();
  for (const user of candidate.users) {
    if (
      !user || typeof user !== 'object' ||
      typeof user.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(user.id) ||
      typeof user.name !== 'string' || !user.name.trim() || user.name.length > 100 ||
      typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || user.email.length > 254 ||
      userIds.has(user.id)
    ) {
      throw new Error(`${sourceName}: обнаружен некорректный или повторяющийся участник.`);
    }
    userIds.add(user.id);
  }

  const taskIds = new Set();
  for (const task of candidate.tasks) {
    if (
      !task || typeof task !== 'object' ||
      typeof task.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(task.id) || taskIds.has(task.id) ||
      typeof task.userId !== 'string' || !userIds.has(task.userId) ||
      typeof task.title !== 'string' || !task.title.trim() || task.title.length > MAX_TITLE_LENGTH ||
      !STATUSES.has(task.status)
    ) {
      throw new Error(`${sourceName}: обнаружена некорректная задача или ссылка на неизвестного участника.`);
    }
    taskIds.add(task.id);
  }

  return { users: candidate.users, tasks: candidate.tasks };
}

function saveData(data) {
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
  try {
    // Запись во временный файл и атомарное переименование не оставляют частичный JSON при сбое.
    writeFileSync(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, {
      flag: 'wx',
      mode: 0o600,
    });
    renameSync(temporaryFile, dataFile);
  } finally {
    rmSync(temporaryFile, { force: true });
  }
}

function loadData() {
  try {
    const parsed = JSON.parse(readFileSync(dataFile, 'utf8'));
    return assertDatabase(parsed, `Файл данных ${dataFile}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error(`Не удалось прочитать базу данных: ${error.message}`, { cause: error });
    }
    mkdirSync(dirname(dataFile), { recursive: true });
    const initialData = assertDatabase(seed, 'Начальные данные');
    if (initialData.tasks.length < 8) {
      throw new Error('Начальные данные должны содержать минимум 8 задач.');
    }
    saveData(initialData);
    return initialData;
  }
}

let data = loadData();
const userIds = new Set(data.users.map((user) => user.id));

function saveTasks(tasks) {
  const updated = { ...data, tasks };
  assertDatabase(updated, 'Обновляемые данные');
  saveData(updated);
  data = updated;
}

function respondWithError(res, status, message) {
  return res.status(status).json({ message });
}

function validateBodyObject(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return respondWithError(res, 400, 'Тело запроса должно быть JSON-объектом.');
  }
  next();
}

function validateTaskTitle(title) {
  return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= MAX_TITLE_LENGTH;
}

function validateStatus(status) {
  return STATUSES.has(status);
}

const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  maxAge: 600,
}));
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    return respondWithError(res, 403, 'Запрос с этого источника запрещён.');
  }
  next();
});
app.use(express.json({ limit: '16kb', strict: true }));

app.get('/users', (req, res) => {
  res.json(data.users);
});

app.get('/tasks', (req, res) => {
  const { userId, status } = req.query;
  if (typeof userId !== 'string' || !userId.trim() || userId.length > MAX_USER_ID_LENGTH) {
    return respondWithError(res, 400, 'Укажите один корректный параметр userId.');
  }
  if (status !== undefined && !validateStatus(status)) {
    return respondWithError(res, 400, 'Допустимые статусы задачи: todo, doing, done.');
  }
  if (!userIds.has(userId)) {
    return respondWithError(res, 404, 'Участник не найден.');
  }

  const tasks = data.tasks.filter((task) => {
    return task.userId === userId && (status === undefined || task.status === status);
  });
  res.json(tasks);
});

app.param('id', (req, res, next, id) => {
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
    return respondWithError(res, 404, 'Задача не найдена.');
  }
  const index = data.tasks.findIndex((task) => task.id === id);
  if (index === -1) return respondWithError(res, 404, 'Задача не найдена.');
  res.locals.taskIndex = index;
  next();
});

app.get('/tasks/:id', (req, res) => {
  res.json(data.tasks[res.locals.taskIndex]);
});

app.post('/tasks', validateBodyObject, (req, res) => {
  const body = req.body;
  const allowedKeys = new Set(['userId', 'title', 'status']);
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) {
    return respondWithError(res, 400, 'Допустимые поля: userId, title и status.');
  }

  const { userId, title, status = 'todo' } = body;
  if (typeof userId !== 'string' || !userId.trim() || userId.length > MAX_USER_ID_LENGTH) {
    return respondWithError(res, 400, 'Укажите корректный строковый ID участника (userId).');
  }
  if (!validateTaskTitle(title)) {
    return respondWithError(res, 400, `Название должно содержать от 1 до ${MAX_TITLE_LENGTH} символов.`);
  }
  if (!validateStatus(status)) {
    return respondWithError(res, 400, 'Допустимые статусы задачи: todo, doing, done.');
  }
  if (!userIds.has(userId)) {
    return respondWithError(res, 404, 'Участник не найден.');
  }

  const task = { id: randomUUID(), userId, title: title.trim(), status };
  saveTasks([...data.tasks, task]);
  res.location(`/tasks/${task.id}`).status(201).json(task);
});

app.patch('/tasks/:id', validateBodyObject, (req, res) => {
  const body = req.body;
  const fields = Object.keys(body);
  if (fields.length === 0 || fields.some((field) => field !== 'title' && field !== 'status')) {
    return respondWithError(res, 400, 'Передайте только title, status или оба поля.');
  }
  if (Object.hasOwn(body, 'title') && !validateTaskTitle(body.title)) {
    return respondWithError(res, 400, `Название должно содержать от 1 до ${MAX_TITLE_LENGTH} символов.`);
  }
  if (Object.hasOwn(body, 'status') && !validateStatus(body.status)) {
    return respondWithError(res, 400, 'Допустимые статусы задачи: todo, doing, done.');
  }

  const index = res.locals.taskIndex;
  const task = { ...data.tasks[index] };
  if (Object.hasOwn(body, 'title')) task.title = body.title.trim();
  if (Object.hasOwn(body, 'status')) task.status = body.status;

  const tasks = data.tasks.slice();
  tasks[index] = task;
  saveTasks(tasks);
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = data.tasks.slice();
  tasks.splice(res.locals.taskIndex, 1);
  saveTasks(tasks);
  res.status(204).end();
});

app.use((req, res) => {
  respondWithError(res, 404, 'Маршрут не найден.');
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return respondWithError(res, 400, 'Некорректный JSON.');
  }
  if (error.type === 'entity.too.large') {
    return respondWithError(res, 413, 'Тело запроса слишком большое (максимум 16 КБ).');
  }
  if (error.status >= 400 && error.status < 500) {
    return respondWithError(res, error.status, 'Не удалось обработать запрос.');
  }
  console.error(error);
  respondWithError(res, 500, 'Внутренняя ошибка сервера.');
});

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error('PORT должен быть целым числом от 0 до 65535.');
}

const server = app.listen(port, host);
server.on('listening', () => {
  console.log(`API запущен на http://${host}:${server.address().port}`);
});
server.on('error', (error) => {
  console.error(`Не удалось запустить API: ${error.message}`);
  process.exitCode = 1;
});

function shutdown() {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
