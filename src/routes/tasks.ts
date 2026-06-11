import { Router } from "express";

import asyncHandler from "../middlewares/asyncHandler.js"
import { getAllTasks, getTask, postTask, deleteTask, updateTask } from "../controllers/tasksController.js"
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchemas.js";
import validateBody from "../middlewares/validate.js";

const router = Router({mergeParams: true})

router.get('/', asyncHandler(getAllTasks))
router.get('/:taskId', asyncHandler(getTask))
router.post('/', validateBody(createTaskSchema), asyncHandler(postTask))
router.patch('/:taskId', validateBody(updateTaskSchema), asyncHandler(updateTask))
router.delete('/:taskId', asyncHandler(deleteTask))

export default router