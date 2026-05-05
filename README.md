# Task Manager API

A small REST API for managing task lists and their tasks, built with Express 5 and validated with Zod. Data is held in memory, so the store resets each time the server restarts.

## Features

- CRUD for lists
- CRUD for tasks scoped under a list
- Query-param filtering on tasks (`status`, `dueDate`, `name`)
- Schema validation with Zod
- Centralized error handling with custom `NotFoundError` and `ValidationError`
- Security and logging middleware via `helmet`, `cors`, and `morgan`

## Tech Stack

- Node.js (ES Modules)
- Express 5
- Zod 4
- Helmet, CORS, Morgan
- dotenv
- nodemon (dev)

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Run

```bash
# development (nodemon)
npm run dev

# production
npm start
```

The server listens on `process.env.PORT` or `3000`.

### Environment

Create a `.env` file at the project root if you want to override the port:

```
PORT=3000
```

## Project Structure

```
.
├── app.js                  # Express app + middleware wiring
├── server.js               # Entry point
├── routes/
│   ├── lists.js            # /lists routes (mounts tasks)
│   └── tasks.js            # /lists/:listId/tasks routes
├── controllers/
│   ├── listsController.js
│   └── tasksController.js
├── schemas/
│   ├── listSchemas.js      # Zod schema for lists
│   └── taskSchemas.js      # Zod create/update schemas for tasks
├── middlewares/
│   ├── validate.js         # Body validator factory
│   └── errorHandler.js     # Central error handler
├── errors/
│   └── customErrors.js     # NotFoundError, ValidationError
└── data/
    └── store.js            # In-memory store
```

## API

Base URL: `http://localhost:3000`

### Lists

| Method | Endpoint      | Description           | Body                |
| ------ | ------------- | --------------------- | ------------------- |
| GET    | `/lists`      | Get all lists         | —                   |
| GET    | `/lists/:id`  | Get a list by id      | —                   |
| POST   | `/lists`      | Create a list         | `{ "name": string }` |
| PATCH  | `/lists/:id`  | Update a list's name  | `{ "name": string }` |
| DELETE | `/lists/:id`  | Delete a list         | —                   |

**List shape**

```json
{
  "id": "1730000000000",
  "name": "Groceries",
  "createdAt": "2026-05-05T12:00:00.000Z"
}
```

### Tasks

Tasks are nested under a list.

| Method | Endpoint                              | Description                      |
| ------ | ------------------------------------- | -------------------------------- |
| GET    | `/lists/:listId/tasks`                | Get all tasks for a list         |
| GET    | `/lists/:listId/tasks/:taskId`        | Get a single task                |
| POST   | `/lists/:listId/tasks`                | Create a task in the list        |
| PATCH  | `/lists/:listId/tasks/:taskId`        | Update one or more task fields   |
| DELETE | `/lists/:listId/tasks/:taskId`        | Delete a task                    |

**Filtering** `GET /lists/:listId/tasks` accepts these query params:

- `status` — `pending` or `done`
- `dueDate` — ISO datetime string
- `name` — exact match

Unknown query keys return `422`.

**Create task body**

```json
{
  "name": "Buy milk",
  "description": "2L whole milk",
  "dueDate": "2026-05-10T18:00:00.000Z"
}
```

**Update task body** (any subset of these fields, at least one required)

```json
{
  "name": "Buy oat milk",
  "description": "1L",
  "status": "done",
  "dueDate": "2026-05-11T18:00:00.000Z"
}
```

**Task shape**

```json
{
  "listId": "1730000000000",
  "id": "uuid",
  "createdAt": "2026-05-05T12:00:00.000Z",
  "dueDate": "2026-05-10T18:00:00.000Z",
  "status": "pending",
  "name": "Buy milk",
  "description": "2L whole milk"
}
```

## Error Format

Errors are returned as JSON with the appropriate HTTP status:

```json
{
  "error": "Invalid field(s)",
  "details": {
    "name": ["String must contain at least 1 character(s)"]
  }
}
```

| Status | When                                                  |
| ------ | ----------------------------------------------------- |
| 404    | List or task id not found                             |
| 422    | Body fails Zod validation, or unknown query parameter |
| 500    | Unhandled errors                                      |

## Notes

- The store is in memory only — restarting the server clears all data.
- List ids are timestamp strings; task ids are UUIDs.
