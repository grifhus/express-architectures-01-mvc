/**
 * @file Configuration for Swagger/OpenAPI documentation generation.
 * This file uses `swagger-jsdoc` to define the API's metadata and security schemes,
 * and specifies the source files where JSDoc comments for API endpoints and DTOs are located.
 */

import swaggerJSDoc from "swagger-jsdoc";

/**
 * Options for `swagger-jsdoc`.
 * Defines the OpenAPI version, API information, server details, security schemes, and API file paths.
 */
const swaggerOptions: swaggerJSDoc.Options = {
  /**
   * The base OpenAPI definition.
   */
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express MVC API",
      version: "1.0.0",
      description: "API documentation for the Express MVC project",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        /**
         * Security scheme for JWT Bearer Token authentication.
         */
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  /**
   * Paths to files containing OpenAPI (Swagger) annotations.
   * These files will be parsed by `swagger-jsdoc` to generate the API documentation.
   */
  apis: ["./src/routes/*.ts", "./src/dtos/*.ts"],
};

/**
 * The generated Swagger specification object.
 * This object is used by `swagger-ui-express` to render the API documentation.
 */
export const swaggerSpec = swaggerJSDoc(swaggerOptions);
