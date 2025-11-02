import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "@models/User";

/**
 * Defines the possible statuses for a task.
 */
export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

/**
 * Represents a Task entity in the application.
 * This entity is mapped to the 'tasks' table in the database.
 */
@Entity({ name: "tasks" })
export class Task {
  /**
   * The unique identifier for the task.
   * Generated automatically as a UUID.
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * The title of the task.
   */
  @Column()
  title!: string;

  /**
   * An optional detailed description of the task.
   */
  @Column({ type: "text", nullable: true })
  description?: string;

  /**
   * The current status of the task.
   * Defaults to `TaskStatus.PENDING`.
   */
  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  /**
   * The user who owns this task.
   * This is a many-to-one relationship with the User entity.
   */
  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user!: User;

  /**
   * The date and time when the task was created.
   * Automatically set on creation.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * The date and time when the task was last updated.
   * Automatically updated on each entity update.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
