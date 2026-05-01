import { Router } from "express";
import { getAllTasks, getTask, postTask, deleteTask, updateTask } from "../controllers/tasksController.js"

const router = Router({mergeParams: true})

router.get('/', getAllTasks)
router.get('/:taskId', getTask)
router.post('/', postTask)
router.patch('/:taskId', updateTask)
router.delete('/:taskId', deleteTask)

export default router