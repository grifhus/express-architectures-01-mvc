import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Task } from "@models/Task";

/**
 * Represents a User entity in the application.
 * This entity is mapped to the 'users' table in the database.
 */
@Entity({ name: "users" })
export class User {
  /**
   * The unique identifier for the user.
   * Generated automatically as a UUID.
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * The name of the user.
   */
  @Column()
  name!: string;

  /**
   * The email address of the user.
   * Must be unique across all users.
   */
  @Column({ unique: true })
  email!: string;

  /**
   * The hashed password of the user.
   */
  @Column()
  password!: string;

  /**
   * A one-to-many relationship with Task entities.
   * Represents all tasks created by this user.
   */
  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  /**
   * The date and time when the user was created.
   * Automatically set on creation.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * The date and time when the user was last updated.
   * Automatically updated on each entity update.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
