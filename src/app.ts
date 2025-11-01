import express from "express";
import helmet from "helmet";
import "reflect-metadata";
import AuthRoutes from "@http/routes/AuthRoutes";
import TaskRoutes from "@http/routes/TaskRoutes";
import { errorHandler } from "@http/middlewares/ErrorHandler";

export const app = express();

// Middleware
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/tasks", TaskRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Base Project API!");
});

// Error handling middleware (must be last)
app.use(errorHandler);
