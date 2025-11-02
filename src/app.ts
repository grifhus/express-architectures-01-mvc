/**
 * @file This file configures and sets up the Express application.
 * It includes middleware, routes, and error handling.
 */

import express from "express";
import helmet from "helmet";
import "reflect-metadata";
import pinoHttp from "pino-http";
import pino from "pino";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middlewares/ErrorHandler";
import AuthRoutes from "@routes/AuthRoutes";
import TaskRoutes from "@routes/TaskRoutes";
import { config } from "@config/index";

/**
 * The main Express application instance.
 */
export const app = express();

/**
 * Configures the Pino logger for the application.
 * In development, it uses `pino-pretty` for human-readable output.
 * In other environments, it outputs JSON for machine readability.
 */
const logger = pino({
  msgPrefix: undefined, // Explicitly define msgPrefix to satisfy pino-http's type definition
  transport:
    config.nodeEnv === "development" ? { target: "pino-pretty" } : undefined,
});

// --- Middleware --- //

// Pino-http middleware for logging requests and responses
// @ts-expect-error: Type 'Logger<never>' is not assignable to type 'Logger<never, boolean> | undefined'.
app.use(pinoHttp({ logger: logger as pino.Logger }));

/**
 * Middleware for setting various HTTP headers to improve security.
 */
app.use(helmet());

/**
 * Middleware for parsing JSON request bodies.
 */
app.use(express.json());

// --- API Documentation --- //

/**
 * Serves the interactive Swagger UI documentation at the /api-docs endpoint.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes --- //

/**
 * Mounts authentication-related routes under the /api/auth path.
 */
app.use("/api/auth", AuthRoutes);

/**
 * Mounts task-related routes under the /api/tasks path.
 */
app.use("/api/tasks", TaskRoutes);

/**
 * Defines a simple root endpoint to check API status.
 * @param req The Express request object.
 * @param res The Express response object.
 */
app.get("/", (req, res) => {
  req.log.info("Hello from the root route!");
  res.send("Welcome to the MVC Project API!");
});

// --- Error Handling --- //

/**
 * Global error handling middleware.
 * This must be the last middleware added to the Express app.
 * It catches errors thrown by route handlers and other middleware,
 * formats them, and sends an appropriate HTTP response.
 */
app.use(errorHandler);
