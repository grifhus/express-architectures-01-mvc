# Base Project for Express + TypeScript Architectures

[English](README.en.md) | [Español](README.md)

This project serves as a robust base for implementing various architectural patterns using Express.js and TypeScript. It includes essential configurations, database setup with TypeORM, JWT authentication, and automated code quality checks.

## Table of Contents
- [Development Journal](DEVELOPMENT_JOURNAL.en.md)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Database Migrations](#database-migrations)
- [Authentication (JWT)](#authentication-jwt)
- [Protected Routes](#protected-routes)
- [Code Quality & Automation](#code-quality--automation)

## Features
- Express.js server with TypeScript (app definition separated from server startup)
- PostgreSQL database integration via TypeORM
- JWT (JSON Web Token) based authentication
- User registration and login functionality
- Protected API routes (e.g., for tasks)
- Data Transfer Objects (DTOs) with `class-validator` for request validation
- Centralized global error handling middleware
- Environment variable management with `dotenv`
- Logging with `pino`
- Security headers with `helmet`
- Code linting with ESLint
- Code formatting with Prettier
- Unit/Integration testing setup with Jest (including a passing basic API test)
- CI/CD pipeline configuration with GitHub Actions
- Git pre-commit hooks for automated code quality checks (Husky & lint-staged)

## Technologies
- Node.js 20+
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- `bcryptjs` (for password hashing)
- `jsonwebtoken` (for JWT)
- `class-validator`, `class-transformer`
- `dotenv`
- `helmet`
- `pino`
- Jest, Supertest, `ts-jest`
- ESLint, Prettier
- Husky, lint-staged
- `module-alias` (for path aliases in production builds)
- `tsconfig-paths` (for path aliases in development builds)

## Prerequisites
- Node.js (v20 or higher)
- npm (Node Package Manager)
- PostgreSQL database instance (local or remote/VPS)
- Git

## Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd base-project
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the project root based on `.env.example` and fill in your details:
    ```dotenv
    PORT=3000
    NODE_ENV=development

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=tasks_db

    JWT_SECRET=your_jwt_secret_key_here
    ```
    *Make sure to use a strong, unique secret for `JWT_SECRET`.*

## Running the Project

-   **Development Mode (with hot-reload):**
    ```bash
    npm run dev
    ```
-   **Build for Production:**
    ```bash
    npm run build
    ```
-   **Start Production Server:**
    ```bash
    npm start
    ```

## Database Migrations

This project uses TypeORM for database management. Initial entities (`User`, `Task`) are defined.

1.  **Generate a new Migration:**
    To create a new migration based on changes to your entities:
    ```bash
    npm run migration:generate -- src/data/migrations/YourMigrationName
    ```
2.  **Run Migrations:**
    To apply pending migrations to your database:
    ```bash
    npm run migration:run
    ```
3.  **Revert Last Migration:**
    To undo the last applied migration:
    ```bash
    npm run migration:revert
    ```

## Authentication (JWT)

The project includes a complete JWT authentication system:
-   **`POST /api/auth/register`**: Register a new user.
    -   Body: `{ "name": "...", "email": "...", "password": "..." }`
-   **`POST /api/auth/login`**: Log in an existing user.
    -   Body: `{ "email": "...", "password": "..." }`
    -   Returns: `{ "token": "...", "user": { ... } }`

## Protected Routes

Routes under `/api/tasks` are protected by `authMiddleware`. To access them, include the JWT obtained from login in the `Authorization` header:

`Authorization: Bearer <your_jwt_token>`

-   **`POST /api/tasks`**: Create a new task (requires authentication).
    -   Body: `{ "title": "...", "description"?: "...", "status"?: "pending" | "in_progress" | "done" }`
-   **`GET /api/tasks`**: Get tasks for the authenticated user (requires authentication).

## Code Quality & Automation

-   **ESLint:** Static code analysis for identifying problematic patterns.
    -   `npm run lint`: Check for linting errors.
    -   `npm run lint:fix`: Automatically fix linting errors.
-   **Prettier:** Automated code formatter for consistent style.
    -   `npm run prettier`: Check for formatting issues.
    -   `npm run prettier:fix`: Automatically fix formatting issues.
-   **Jest:** Testing framework with a passing basic API test.
    -   `npm test`: Run all tests.
-   **GitHub Actions:** Automates linting, formatting, and testing on `push` and `pull_request` events.
-   **Husky & lint-staged:** Pre-commit hooks to ensure staged files are linted and formatted automatically before committing.
