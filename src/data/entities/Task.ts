import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
