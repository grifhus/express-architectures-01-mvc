import { AppDataSource } from "@config/data-source";
import { Task } from "@data/entities/Task";
import { User } from "@data/entities/User";
import { CreateTaskDto } from "@http/dtos/CreateTaskDto";

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

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

  async getTasksByUser(user: User): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: user.id } } });
  }
}
