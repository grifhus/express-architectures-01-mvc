import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Centralized configuration object.
 * This object loads environment variables from the .env file and provides them to the rest of the application.
 * This makes it easier to manage configuration in different environments and avoids the use of process.env throughout the code.
 */
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    name: process.env.DB_NAME || "tasks_db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_super_secret_key",
  },
};
