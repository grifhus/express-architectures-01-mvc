# Development Journal: Creating the `base-project`

[English](DEVELOPMENT_JOURNAL.en.md) | [Español](DEVELOPMENT_JOURNAL.md)

This document chronicles the process of creating, debugging, and refining the `base-project`, which will serve as a template for various software architecture projects.

## Phase 1: Initial Planning and Scope

The initial goal was to create a base project with Express and TypeScript to avoid repetition when building 7 different architectures. The initial technology stack included TypeORM, PostgreSQL, Jest, ESLint, and Prettier.

### Key Improvement Decisions:

It was proposed to enrich the base project with professional features to make it not just a "hello world" but a solid and scalable foundation. Key agreed-upon additions were:

1.  **Database Migrations:** Use the TypeORM CLI to version the database schema.
2.  **Security:** Add `helmet` for security headers and `jsonwebtoken` for authentication.
3.  **Quality Automation:** Implement `husky` and `lint-staged` to run quality checks before each commit.
4.  **Continuous Integration (CI):** Add a GitHub Actions workflow to automatically run tests and linters.
5.  **Centralized Error Handling:** Create a global middleware for error handling.
6.  **Basic Unit Tests:** Add an initial test to validate the Jest configuration.

## Phase 2: Implementation and Debugging

This phase was the most intensive, where we built the project and faced several real-world problems.

### 1. Entity Creation and Migrations

-   **Action:** `User` and `Task` entities were created with TypeORM, and the initial migration was generated.
-   **Problem 1: Syntax Error in `package.json`**
    -   **Symptom:** `npm install` failed with an `EJSONPARSE` error.
    -   **Cause:** Incorrectly formatted quotes within the `prettier` scripts invalidated the JSON.
    -   **Solution:** The quote syntax in `package.json` was corrected.
-   **Problem 2: Migration Generation Failure (Arguments)**
    -   **Symptom:** `npm run migration:generate` failed with `Missing required argument: dataSource`.
    -   **Cause:** `npm` was not passing arguments correctly to the `typeorm` script.
    -   **Solution:** The script in `package.json` was modified to use `--` (e.g., `npm run typeorm -- migration:generate ...`), which is the correct way to pass arguments to sub-scripts.
-   **Problem 3: Database Connection Failure**
    -   **Symptom:** Authentication errors (`password authentication failed`) and host resolution errors (`getaddrinfo ENOTFOUND`).
    -   **Cause:** Incorrect credentials and host in the user's `.env` file.
    -   **Solution:** Debugging code (`console.log`) was temporarily added to `data-source.ts` to help the user verify their `.env` file and correct it.
-   **Problem 4: Duplicate Migrations**
    -   **Symptom:** `npm run migration:run` failed with `type "tasks_status_enum" already exists`.
    -   **Cause:** Multiple failed attempts to generate migrations had created several migration files. The first one succeeded, and the second failed trying to create the same type.
    -   **Solution:** All existing migration files were deleted, the user was asked to manually clean the database one last time, a single new migration was generated, and finally `npm run migration:run` executed successfully.

### 2. JWT Authentication Implementation

-   **Action:** A complete authentication flow was implemented.
-   **Libraries and Justification:
    -   `bcryptjs`: Industry standard for secure password hashing. Crucial for never storing plain-text passwords.
    -   `jsonwebtoken`: The most popular library for creating and verifying JSON Web Tokens.
-   **Componentes Creados:** `AuthService` (logic), `AuthController` (request handling), `AuthRoutes` (routes), and DTOs (`RegisterUserDto`, `LoginUserDto`) for validation.

### 3. Verificación y Pulido Final

-   **Problema 5: Build Failure (`npm run build`) due to Path Aliases**
    -   **Symptom:** `tsc` could not resolve imports like `@config/...`.
    -   **Cause:** Although aliases were defined in `tsconfig.json`, files were using relative paths (`../../...`).
    -   **Solution:** All imports were refactored to use path aliases, making the code cleaner and more maintainable.
-   **Problema 6: Test Failure (`npm test`) due to `SyntaxError` (`import` in `.js`)**
    -   **Symptom:** Tests failed because Jest did not transpile `jest.setup.js`.
    -   **Cause:** Jest did not process `.js` files with TypeScript syntax.
    -   **Solution:** `jest.setup.js` was renamed to `jest.setup.ts`, and Jest configuration in `package.json` was updated to reflect this.
-   **Problema 7: Test Failure (`npm test`) due to `EADDRINUSE`**
    -   **Symptom:** Tests failed because port `3000` was already in use.
    -   **Cause:** The `index.ts` file started the server when imported by Jest, causing a conflict with `supertest`'s test server.
    -   **Solution:** The code was refactored by separating the application definition into `src/app.ts` and the server startup into `src/index.ts`. This is a standard practice for allowing tests to import the application safely.
-   **Problema 8: Development Failure (`npm run dev`) due to Path Aliases**
    -   **Symptom:** `npm run dev` failed because `ts-node-dev` did not resolve path aliases.
    -   **Cause:** `ts-node-dev` did not understand aliases like `@config/...`.
    -   **Solution:** `tsconfig-paths` was installed and configured to integrate with `ts-node-dev`.
-   **Problema 9: Production Failure (`npm start`) due to Path Aliases**
    -   **Symptom:** The compiled code in `dist/` could not resolve path aliases, even after previous corrections.
    -   **Cause:** `tsc` compiles to JS but does not replace aliases. `module-alias` was imported too late.
    -   **Solution:** `module-alias` was installed and configured. The line `import 'module-alias/register';` was moved to the first line of `src/index.ts` to ensure it activated before any attempt to resolve aliases.

-   **Problema 10: GitHub Actions Workflow Failure (Linting/Formatting)**
    -   **Symptom:** The workflow triggered by `push` failed with Prettier and ESLint errors.
    -   **Cause:** `ci.yml` did not include the `master` branch. Also, ESLint reported `'_next' is defined but never used` despite renaming the parameter.
    -   **Solution:** `ci.yml` was updated to include `master`. The `.eslintrc.js` file was configured so that the `@typescript-eslint/no-unused-vars` rule explicitly allowed parameters starting with an underscore (`_`).

- **Problem 11: Husky `pre-commit` Hook Was Not Blocking Commits**
  - **Symptom:** Commits were successfully created even when linting errors existed, and `lint-staged` displayed the message "could not find any staged files."
  - **Cause:** The original `.husky/pre-commit` script was written for a Unix-style shell (`sh`), and `lint-staged` was not correctly detecting staged files in the Windows/PowerShell environment.
  - **Solution:** The `.husky/pre-commit` script was modified to directly run `npm run lint:fix` and `npm run prettier:fix`. This ensures that all `.ts` files in the `src` directory are linted and formatted before each commit, regardless of `lint-staged` behavior.



## Phase 4: Repository Strategy

Various strategies for organizing projects in Git were discussed:

1.  **Monorepo:** A single repository for all projects. This was initially considered but discarded due to the added complexity of tools like Nx or Turborepo, which would distract from the main goal.
2.  **Git Submodules:** A main repository with "links" to sub-repositories. This was discarded due to its notorious complexity and difficulty in management.
3.  **Multi-repo (Chosen Option):** A separate, independent repository for each project. This was concluded to be the cleanest, simplest, and most educational option for our goal of learning and comparing architectures in isolation.

## Final State of the `base-project`

The base project is in a complete, verified, and professional state. It includes a functional codebase, an authentication system, database management with migrations, and a robust set of tools to ensure code quality and automation. It is ready to be versioned and cloned for subsequent projects.
