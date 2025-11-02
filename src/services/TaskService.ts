import { injectable } from "tsyringe";
import { AppDataSource } from "@config/data-source";
import { Task } from "@models/Task";
import { User } from "@models/User";
import { CreateTaskDto } from "@dtos/CreateTaskDto";

/**
 * Service for handling task-related logic.
 * It is decorated with @injectable() to allow tsyringe to manage its lifecycle.
 */
@injectable()
export class TaskService {
  /**
   * The TypeORM repository for Task entities.
   * @private
   */
  private taskRepository = AppDataSource.getRepository(Task);

  /**
   * Creates a new task for a given user.
   * @param createTaskDto Data transfer object containing task creation details.
   * @param user The user for whom the task is being created.
   * @returns A Promise that resolves with the newly created Task entity.
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, status } = createTaskDto;

    const newTask = this.taskRepository.create({
      title,
      description,
      status,
      user,
    });

    await this.taskRepository.save(newTask);
    return newTask;
  }

  /**
   * Retrieves all tasks associated with a specific user.
   * @param user The user whose tasks are to be retrieved.
   * @returns A Promise that resolves with an array of Task entities.
   */
  async getTasksByUser(user: User): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: user.id } } });
  }
}
