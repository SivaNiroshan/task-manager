import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
    createTask,
    getMyTasks,
    updateTask,
    deleteTask
} from "../controllers/task.controller";

const router = Router();

// Protect all task routes
router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getMyTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
