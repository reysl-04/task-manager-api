import { Router } from "express"
import taskRouter from "./tasks.js"

import asyncHandler from "../middlewares/asyncHandler.js"
import { getAllUsers, getUser, postUser, updateUser, deleteUser } from "../controllers/usersControllers.js"
import { updateUserSchema, createUserSchema } from "../schemas/userSchema.js"
import validateBody from "../middlewares/validate.js"

const router = Router()

router.get('/', asyncHandler(getAllUsers))
router.use('/:userId/tasks', taskRouter)

router.get('/:userId', asyncHandler(getUser))
router.post('/', validateBody(createUserSchema), asyncHandler(postUser))
router.patch('/:userId', validateBody(updateUserSchema), asyncHandler(updateUser))
router.delete('/:userId', asyncHandler(deleteUser))
