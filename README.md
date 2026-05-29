# Task Manager API

A REST API for managing users and their tasks, built with Express and PostgreSQL. Replaces the previous in-memory store with a real relational database, adding users as a resource with tasks scoped to them.

## Features

- CRUD for users
- CRUD for tasks scoped under a user
- Query-param filtering on tasks (`status`, `due_date`)
- Schema validation with Zod
- Centralized error handling with custom `NotFoundError` and `ValidationError`
- Security and logging middleware via `helmet`, `cors`, and `morgan`
- Database migrations and seeders
- Connection pooling with `pg`
- Dockerized Postgres for local development

## Tech Stack

- Node.js (ES Modules)
- Express 5
- PostgreSQL 16
- Zod 4
- node-postgres (`pg`)
- bcrypt
- Docker Compose
- Helmet, CORS, Morgan
- dotenv
- nodemon (dev)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker

### Install

```bash
npm install
```

### Environment

Create a `.env` file at the project root:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5433/<dbname>
PORT=3000
NODE_ENV=development
```

### Start the database

```bash
docker compose up -d
```

### Run migrations

```bash
npm run migrate
```

### Seed the database

```bash
npm run seed
```

### Run

```bash
# development (nodemon)
npm run dev

# production
npm start
```

The server listens on `process.env.PORT` or `3000`.

## Project Structure

```
.
├── docker-compose.yml
├── app.js                        # Express app + middleware wiring
├── server.js                     # Entry point
├── src/
│   ├── db/
│   │   ├── pool.js               # pg Pool instance
│   │   ├── migrate.js            # Migration runner
│   │   ├── seed.js               # Seeder script
│   │   └── migrations/
│   │       ├── 001_create_users.sql
│   │       ├── 002_create_tasks.sql
│   │       └── 003_update_tasks.sql
│   ├── routes/
│   │   ├── users.js              # /users routes (mounts tasks)
│   │   └── tasks.js              # /users/:userId/tasks routes
│   ├── controllers/
│   │   ├── usersController.js
│   │   └── tasksController.js
│   ├── services/
│   │   └── usersService.js
│   ├── schemas/
│   │   ├── userSchema.js         # Zod schemas for users
│   │   └── taskSchemas.js        # Zod schemas for tasks
│   ├── middlewares/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── validate.js           # Body validator factory
│   │   └── errorHandler.js       # Central error handler
│   └── errors/
│       └── customErrors.js       # NotFoundError, ValidationError
```

## API

Base URL: `https://task-manager-api-production-5765.up.railway.app`

### Users

| Method | Endpoint       | Description          | Body                                          |
| ------ | -------------- | -------------------- | --------------------------------------------- |
| GET    | `/users`       | Get all users        | —                                             |
| GET    | `/users/:id`   | Get a user by id     | —                                             |
| POST   | `/users`       | Create a user        | `{ "name", "email", "password" }`             |
| PATCH  | `/users/:id`   | Update a user        | `{ "name"?, "email"? }` (at least one)        |
| DELETE | `/users/:id`   | Delete a user        | —                                             |

**User shape**

```json
{
  "id": 1,
  "name": "Axe",
  "email": "axe@gmail.com",
  "created_at": "2026-05-05T12:00:00.000Z"
}
```

> `password_hash` is never returned in any response.

### Tasks

Tasks are nested under a user.

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| GET    | `/users/:userId/tasks`            | Get all tasks for a user       |
| GET    | `/users/:userId/tasks/:taskId`    | Get a single task              |
| POST   | `/users/:userId/tasks`            | Create a task for a user       |
| PATCH  | `/users/:userId/tasks/:taskId`    | Update one or more task fields |
| DELETE | `/users/:userId/tasks/:taskId`    | Delete a task                  |

**Filtering** — `GET /users/:userId/tasks` accepts these query params:

- `status` — `pending` or `done`
- `due_date` — ISO datetime string

Unknown query keys return `422`.

**Create task body**

```json
{
  "title": "Buy milk",
  "description": "2L whole milk",
  "due_date": "2026-05-10T18:00:00.000Z"
}
```

**Update task body** (any subset of these fields, at least one required)

```json
{
  "title": "Buy oat milk",
  "description": "1L",
  "status": "done",
  "due_date": "2026-05-11T18:00:00.000Z"
}
```

**Task shape**

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Buy milk",
  "description": "2L whole milk",
  "status": "pending",
  "due_date": "2026-05-10T18:00:00.000Z",
  "created_at": "2026-05-05T12:00:00.000Z"
}
```

## Schema

```sql
users
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  name          VARCHAR(25)  NOT NULL
  email         VARCHAR(100) NOT NULL UNIQUE CHECK (email LIKE '%@gmail.com')
  password_hash TEXT         NOT NULL
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()

tasks
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE
  title       VARCHAR(50) NOT NULL
  description TEXT
  status      VARCHAR(7)  NOT NULL CHECK (status IN ('pending', 'done'))
  due_date    TIMESTAMPTZ
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()

INDEX idx_tasks_user_id ON tasks(user_id)
```

## Error Format

```json
{
  "error": "Invalid field(s)",
  "details": {
    "title": ["String must contain at least 1 character(s)"]
  }
}
```

| Status | When                                                   |
| ------ | ------------------------------------------------------ |
| 404    | User or task id not found                              |
| 409    | Email already in use                                   |
| 422    | Body fails Zod validation, or unknown query parameter  |
| 500    | Unhandled errors                                       |