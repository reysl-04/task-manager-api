import { Router } from "express";
import { getAllLists, getList, updateList, postList, deleteList } from "../controllers/listsController.js"

const router = Router();

router.get('/', getAllLists);
router.get('/:id', getList);
router.post('/', postList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);

export default router