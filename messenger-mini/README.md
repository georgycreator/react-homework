# Messenger Mini — готовое решение ДЗ по React + TypeScript

Это учебный мини-мессенджер с авторизацией, профилем и общим чатом. Backend из исходного архива сохранён; реализована клиентская часть на React, TypeScript и Vite.

## 1. Что реализовано

- Вход по телефону и паролю через `POST /auth/login` (Axios).
- Сохранение токена в `localStorage` и его удаление при выходе.
- Защита страниц: без токена доступен только `/login`, после входа доступны `/profile` и `/chat`.
- Загрузка профиля через `GET /users/me` (Fetch), показ `nickname`, `phone`, `bio`.
- Изменение `nickname` и `bio` через `PUT /users/me` (Axios).
- Загрузка истории сообщений через `GET /messages` (Fetch).
- Отправка сообщений через `POST /messages` (Axios). Backend рассылает новое сообщение всем WebSocket-клиентам.
- WebSocket-клиент: подключение, статусы соединения, обработка события `message:new`, протокол `message:send` и отключение при уходе со страницы.
- Обработка HTTP 401, ошибок сети, пустого ответа и некорректного JSON для Fetch-запросов.
- Адаптивная вёрстка для компьютера и мобильного экрана; состояния загрузки, ошибки и успешного сохранения.

## 2. Структура

```text
Messenger_Mini/
  frontend/
    src/
      api/            # функции HTTP API и WebSocket-клиент
      components/     # карточка профиля, список и форма сообщений
      helpers/        # localStorage и отображение ошибок
      pages/          # LoginPage, ProfilePage, ChatPage
      App.tsx
      main.tsx
      styles.css
      types.ts
    .env              # адреса API и WebSocket для локального запуска
    package.json
  server/            # уже выданный backend; его код не изменён
  task_condition.md  # исходное условие
```

## 3. Как запустить в VS Code (Windows / PowerShell)

Нужен установленный Node.js и npm. Распакуйте архив, откройте папку `Messenger_Mini` в VS Code. Первый запуск требует установки npm-зависимостей.

### Терминал № 1 — backend

```powershell
cd .\server
npm install
npm start
```

Должны появиться сообщения о запуске API на `http://localhost:3001` и Swagger UI на `http://localhost:3001/docs`. Не закрывайте этот терминал.

### Терминал № 2 — frontend

Откройте второй терминал VS Code и выполните:

```powershell
cd .\frontend
npm install
npm run dev
```

Откройте адрес, который Vite выведет в терминале (обычно `http://localhost:5173`). В `frontend/.env` указаны:

```dotenv
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

Если меняете `.env`, перезапустите `npm run dev`.

## 4. Тестовые пользователи

Все три аккаунта используют пароль `123456`:

| Телефон | Начальный никнейм |
|---|---|
| `+79990000000` | Alex |
| `+79990000001` | Maria |
| `+79990000002` | Sam |

Для проверки обмена сообщениями откройте приложение в двух отдельных окнах/профилях браузера и войдите под разными тестовыми пользователями. Отправленное сообщение должно появиться в обоих чатах.

## 5. Swagger и API
После старта сервера откройте `http://localhost:3001/docs` и найдите:

- `POST /auth/login` — тело `{ "phone": "+79990000000", "password": "123456" }`, ответ содержит `token` и `user`.
- `GET /users/me` — нужен заголовок `Authorization: Bearer <token>`.
- `PUT /users/me` — JSON с полями `nickname` и/или `bio` плюс Bearer-токен.
- `GET /messages` — список сообщений, требует Bearer-токен.
- `POST /messages` — JSON `{ "text": "Привет!" }` плюс Bearer-токен.

WebSocket использует `ws://localhost:3001`. Формат отправки: `{"type":"message:send","payload":{"text":"Привет!","token":"<token>"}}`. Входящие сообщения имеют тип `message:new`.

## 6. Команды проверки frontend
```powershell
cd .\frontend
npm run typecheck
npm run build
```

`npm run build` запускает TypeScript-проверку проектов и сборку Vite в `frontend/dist`. Перед первой проверкой необходимо успешно выполнить `npm install` во frontend и server. Если установка не работает, проверьте доступ к `registry.npmjs.org` и настройки сети/прокси.

## Важное замечание о backend

Тестовые пользователи, токены и сообщения хранятся в памяти процесса. Поэтому после перезапуска backend ранее сохранённый в браузере токен может стать недействительным: нажмите «Выйти» и войдите заново. Это особенность выданного backend, его менять по условию задания не нужно.
