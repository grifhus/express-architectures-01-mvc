import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { TaskController } from "@controllers/TaskController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "@middlewares/AuthMiddleware";
import { validateDto } from "@middlewares/ValidationMiddleware";
import { CreateTaskDto } from "@dtos/CreateTaskDto";

/**
 * Express router for task-related routes.
 * @remarks
 * This router handles operations for creating and retrieving tasks.
 * All routes in this file are protected by `authMiddleware`.
 */
const router = Router();

/**
 * Resolves the TaskController instance from the tsyringe dependency injection container.
 */
const taskController = container.resolve(TaskController);

// Apply the auth middleware to all routes in this file
/**
 * Middleware to ensure the user is authenticated for all task routes.
 * Populates `req.user` with the authenticated user's information.
 */
router.use(authMiddleware);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: The task was successfully created.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.post("/", validateDto(CreateTaskDto), (req: Request, res: Response) =>
  taskController.createTask(req as AuthenticatedRequest, res),
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", (req: Request, res: Response) =>
  taskController.getTasks(req as AuthenticatedRequest, res),
);

export default router;
