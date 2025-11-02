import { IsString, MinLength, IsOptional, IsEnum } from "class-validator";
import { TaskStatus } from "@models/Task";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTaskDto:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task.
 *         description:
 *           type: string
 *           description: The description of the task.
 *         status:
 *           type: string
 *           enum: [pending, in_progress, done]
 *           description: The status of the task.
 */
export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
