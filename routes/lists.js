import { Router } from "express";
import { getAllLists, getList, updateList, postList, deleteList } from "../controllers/listsController.js"
import taskRouter from "./tasks.js"

const router = Router();

router.get('/', getAllLists);
router.use('/:listId/tasks', taskRouter)

router.get('/:id', getList);
router.post('/', postList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);



export default router