import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const taskController = new TaskController();

// Apply the auth middleware to all routes in this file
router.use(authMiddleware);

router.post("/", (req, res) => taskController.createTask(req, res));
router.get("/", (req, res) => taskController.getTasks(req, res));

export default router;
