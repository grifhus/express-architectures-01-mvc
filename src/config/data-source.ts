import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Never use synchronize in production
  logging: false,
  entities: [path.join(__dirname, "../data/entities/**/*.ts")],
  migrations: [path.join(__dirname, "../data/migrations/**/*.ts")],
  subscribers: [],
});
