/**
 * @file Configures and initializes the TypeORM data source for the application.
 * This file is responsible for setting up the database connection using environment variables
 * and registering all entities and migrations.
 */

import "reflect-metadata"; // Required for TypeORM to work with decorators
import { DataSource } from "typeorm";
import path from "path";
import { config } from "./index";
import { User } from "../models/User"; // Explicitly import User entity
import { Task } from "../models/Task"; // Explicitly import Task entity

/**
 * Determines the file extension for migrations based on the current Node.js environment.
 * Uses '.ts' for development and '.js' for other environments (e.g., production).
 */
const migrationExtension = process.env.NODE_ENV === 'development' ? 'ts' : 'js';

/**
 * TypeORM data source configuration.
 * This object defines all the necessary parameters for connecting to the PostgreSQL database,
 * including host, port, credentials, database name, and paths to entities and migrations.
 */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false, // Never use synchronize in production; use migrations instead
  logging: false,
  entities: [User, Task], // Explicitly list entities for reliable discovery
  migrations: [path.join(process.cwd(), `dist/data/migrations/**/*.${migrationExtension}`)],
  subscribers: [],
});
