import "module-alias/register";
import dotenv from "dotenv";
import pino from "pino";
import { AppDataSource } from "@config/data-source";
import { app } from "./app";

dotenv.config();

const logger = pino();
const PORT = process.env.PORT || 3000;

// Database connection and server start
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to the database:", error);
    process.exit(1);
  });
