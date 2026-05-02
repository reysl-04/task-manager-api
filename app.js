import express from "express"
import cors from "cors"
import helmet from "helmet"

import listsRouter from "./routes/lists.js"
import tasksRouter from "./routes/tasks.js"
import errorHandler from "./middlewares/errorHandler.js"

const corsOptions = {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 84500
}

const app = express();

app.use(helment())
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/lists', listsRouter)
app.use('/tasks', tasksRouter)

app.use(errorHandler)

export default app