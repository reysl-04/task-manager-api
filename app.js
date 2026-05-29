import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import usersRouter from "./routes/users.js"
import tasksRouter from "./routes/tasks.js"
import errorHandler from "./middlewares/errorHandler.js"

const corsOptions = {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 84500
}

const app = express();

app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.json({
    name: "Task Manager API",
    version: "1.0",
    documentation: "https://github.com/reysl-04/task-manager-api",
    endpoints: {
      tasks: "GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id",
      lists: "GET /lists, POST /lists, etc."
    },
    status: "ok"
  });
});

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)

app.use(errorHandler)

export default app