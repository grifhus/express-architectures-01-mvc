import { injectable } from "tsyringe";
import { Response } from "express";
import { TaskService } from "@services/TaskService";
import { CreateTaskDto } from "@dtos/CreateTaskDto";
import { AuthenticatedRequest } from "@middlewares/AuthMiddleware";
import { User } from "@models/User";
import { UnauthorizedError } from "@utils/errors";

/**
 * Controller for handling task-related requests.
 * It is decorated with @injectable() to allow tsyringe to manage its lifecycle and dependencies.
 */
@injectable()
export class TaskController {
  /**
   * The constructor receives an instance of TaskService through dependency injection.
   * @param taskService The task service.
   */
  constructor(private taskService: TaskService) {}

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const createTaskDto: CreateTaskDto = req.body; // DTO is now validated and transformed by middleware

    const task = await this.taskService.createTask(
      createTaskDto,
      req.user as User,
    );
    res.status(201).json(task);
  }

  /**
   * Handles requests to get all tasks for the authenticated user.
   * Requires authentication via `authMiddleware`.
   * @param req The authenticated Express request object, containing the `user` property.
   * @param res The Express response object.
   * @returns A Promise that resolves when the response is sent with a list of tasks.
   */
  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const tasks = await this.taskService.getTasksByUser(req.user as User);
    res.json(tasks);
  }
}
