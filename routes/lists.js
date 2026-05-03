import { Router } from "express";
import { getAllLists, getList, updateList, postList, deleteList } from "../controllers/listsController.js"
import listSchemas from "../schemas/listSchemas.js"
import validateBody from "../middlewares/validate.js";
import taskRouter from "./tasks.js"

const router = Router();

router.get('/', getAllLists);
router.use('/:listId/tasks', taskRouter)

router.get('/:id', getList);
router.post('/', validateBody(listSchemas), postList);
router.patch('/:id', validateBody(listSchemas), updateList);
router.delete('/:id', deleteList);



export default router