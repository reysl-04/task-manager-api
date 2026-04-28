import express from "express";
import listsRouter from "./routes/lists.js"
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/lists', listsRouter)

app.use(errorHandler)

export default app