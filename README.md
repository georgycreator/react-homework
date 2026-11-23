# Портфолио учебных проектов по React и TypeScript

Репозиторий содержит практические задания и учебные проекты, выполненные в рамках изучения React, TypeScript и современной веб-разработки.

## Домашнее задание 1 — TypeScript Tasks

[Перейти к проекту](https://github.com/georgycreator/react-homework/tree/main/typescript-tasks)

Практические задания по TypeScript. Изучение типизации переменных, объединений типов, интерфейсов, объектных типов и безопасной работы с данными.

## Домашнее задание 2 — React Seminar

[Перейти к проекту](https://github.com/georgycreator/react-homework/tree/main/seminar3)

Практические задания по React, посвящённые управлению состоянием, оптимизации компонентов и созданию пользовательских хуков.

## Домашнее задание 3 — Messenger Mini

[Перейти к проекту](https://github.com/georgycreator/react-homework/tree/main/messenger-mini)

Мини-приложение для обмена сообщениями, разработанное с использованием React и TypeScript.

Основные возможности:
- Авторизация пользователей.
- Просмотр и редактирование профиля.
- История сообщений.
- Обмен сообщениями в реальном времени с использованием WebSocket.

### Запуск Messenger Mini

**1. Запуск серверной части**

Откройте первый терминал:

```bash
cd messenger-mini/server
npm install
npm start
```

**2. Запуск клиентской части**

Откройте второй терминал:

```bash
cd messenger-mini/frontend
npm install
npm run dev
```

API: [http://localhost:3001](http://localhost:3001)

Документация API (Swagger): [http://localhost:3001/docs](http://localhost:3001/docs)

## Домашнее задание 4 — NORD Market

[Перейти к проекту](https://github.com/georgycreator/react-homework/tree/main/minimarket-styled-components)

Учебный интернет-магазин продуктов, разработанный на React, TypeScript и styled-components в рамках темы «Подходы к стилизации в React».

Основные возможности:
- Собственный UI-kit с типизированными компонентами и transient props.
- Три цветовые темы: светлая, тёмная и ягодная.
- Автоматическое определение системной цветовой схемы и сохранение пользовательских настроек.
- Каталог товаров с поиском и фильтрацией по категориям.
- Корзина с управлением количеством товаров и сохранением данных в localStorage.
- Адаптивная сетка товаров.
- Анимации, состояния загрузки и скелетоны.
- Автоматические тесты на Vitest и React Testing Library.

[Подробное описание проекта и инструкция по запуску](https://github.com/georgycreator/react-homework/blob/main/minimarket-styled-components/README.md)

## Структура репозитория

```text
react-homework/
├── typescript-tasks/
├── seminar3/
├── messenger-mini/
└── minimarket-styled-components/
```

Каждое домашнее задание располагается в отдельной папке и содержит собственный исходный код, зависимости и документацию.