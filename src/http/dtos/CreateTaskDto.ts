import { IsString, MinLength, IsOptional, IsEnum } from "class-validator";
import { TaskStatus } from "@data/entities/Task";

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
