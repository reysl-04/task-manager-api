import express from "express";
import listsRouter from "./routes/lists.js"
import tasksRouter from "./routes/tasks.js"

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/lists', listsRouter)
app.use('/tasks', tasksRouter)

app.use(errorHandler)

export default app