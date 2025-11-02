/**
 * @file This is the main entry point for the Express application.
 * It handles environment variable loading, database initialization, and server startup.
 */

import "reflect-metadata"; // Must be imported first to enable decorator metadata
import dotenv from "dotenv";
import pino from "pino";
import { AppDataSource } from "@config/data-source";
import { app } from "./app";

// Load environment variables from .env file
dotenv.config();

/**
 * Global logger instance for the application.
 * Configured with Pino for high-performance logging.
 */
const logger = pino();

/**
 * The port on which the server will listen.
 * Defaults to 3000 if not specified in environment variables.
 */
const PORT = process.env.PORT || 3000;

/**
 * Handles unhandled promise rejections to prevent the Node.js process from crashing.
 * Logs the rejection details and exits the process with an error code.
 * @param reason The reason for the unhandled rejection.
 * @param promise The promise that was rejected.
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error({ promise, reason }, "Unhandled Rejection at:");
  process.exit(1);
});

/**
 * Initializes the database connection and starts the Express server.
 * If the database connection fails, it logs the error and exits the process.
 */
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error({ error }, "Error connecting to the database:");
    process.exit(1);
  });
