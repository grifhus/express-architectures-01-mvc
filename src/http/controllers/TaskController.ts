import { Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { TaskService } from "../../services/TaskService";
import { CreateTaskDto } from "../dtos/CreateTaskDto";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";
import { User } from "../../data/entities/User";

export class TaskController {
  private taskService = new TaskService();

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const createTaskDto = plainToClass(CreateTaskDto, req.body);
      const errors = await validate(createTaskDto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const task = await this.taskService.createTask(
        createTaskDto,
        req.user as User,
      );
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const tasks = await this.taskService.getTasksByUser(req.user as User);
      res.json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
}
