# Proyecto Base para Arquitecturas Express + TypeScript

[English](README.en.md) | [Español](README.md)

Este proyecto sirve como una base robusta para implementar varios patrones arquitectónicos usando Express.js y TypeScript. Incluye configuraciones esenciales, configuración de base de datos con TypeORM, autenticación JWT y comprobaciones automatizadas de calidad de código.

## Table of Contents
- [Development Journal](DEVELOPMENT_JOURNAL.md)
- [Features](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instrucciones de Configuración](#instrucciones-de-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Migraciones de Base de Datos](#migraciones-de-base-de-datos)
- [Autenticación (JWT)](#autenticación-jwt)
- [Rutas Protegidas](#rutas-protegidas)
- [Calidad de Código y Automatización](#calidad-de-código-y-automatización)

## Características
- Servidor Express.js con TypeScript (definición de la aplicación separada del inicio del servidor)
- Integración de base de datos PostgreSQL a través de TypeORM
- Autenticación basada en JWT (JSON Web Token)
- Funcionalidad de registro e inicio de sesión de usuarios
- Rutas de API protegidas (por ejemplo, para tareas)
- Objetos de Transferencia de Datos (DTOs) con `class-validator` para la validación de solicitudes
- Middleware centralizado de manejo de errores global
- Gestión de variables de entorno con `dotenv`
- Registro de eventos (logging) con `pino`
- Cabeceras de seguridad con `helmet`
- Análisis estático de código con ESLint
- Formateo de código con Prettier
- Configuración de pruebas unitarias/de integración con Jest (incluyendo una prueba básica de API que pasa)
- Configuración de pipeline CI/CD con GitHub Actions
- Hooks pre-commit de Git para comprobaciones automatizadas de calidad de código (Husky y lint-staged)

## Tecnologías
- Node.js 20+
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- `bcryptjs` (para hash de contraseñas)
- `jsonwebtoken` (para JWT)
- `class-validator`, `class-transformer`
- `dotenv`
- `helmet`
- `pino`
- Jest, Supertest, `ts-jest`
- ESLint, Prettier
- Husky, lint-staged
- `module-alias` (para alias de ruta en compilaciones de producción)
- `tsconfig-paths` (para alias de ruta en compilaciones de desarrollo)

## Prerrequisitos
- Node.js (v20 o superior)
- npm (Node Package Manager)
- Instancia de base de datos PostgreSQL (local o remota/VPS)
- Git

## Instrucciones de Configuración

1.  **Clonar el Repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd base-project
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` y rellena tus datos:
    ```dotenv
    PORT=3000
    NODE_ENV=development

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=tasks_db

    JWT_SECRET=tu_clave_secreta_jwt_aqui
    ```
    *Asegúrate de usar una clave secreta fuerte y única para `JWT_SECRET`.*

## Ejecución del Proyecto

-   **Modo Desarrollo (con recarga en caliente):**
    ```bash
    npm run dev
    ```
-   **Compilar para Producción:**
    ```bash
    npm run build
    ```
-   **Iniciar Servidor de Producción:**
    ```bash
    npm start
    ```

## Migraciones de Base de Datos

Este proyecto utiliza TypeORM para la gestión de la base de datos. Las entidades iniciales (`User`, `Task`) están definidas.

1.  **Generar una nueva Migración:**
    Para crear una nueva migración basada en cambios en tus entidades:
    ```bash
    npm run migration:generate -- src/data/migrations/TuNombreDeMigracion
    ```
2.  **Ejecutar Migraciones:**
    Para aplicar las migraciones pendientes a tu base de datos:
    ```bash
    npm run migration:run
    ```
3.  **Revertir Última Migración:**
    Para deshacer la última migración aplicada:
    ```bash
    npm run migration:revert
    ```

## Autenticación (JWT)

El proyecto incluye un sistema completo de autenticación JWT:
-   **`POST /api/auth/register`**: Registra un nuevo usuario.
    -   Cuerpo: `{ "name": "...", "email": "...", "password": "..." }`
-   **`POST /api/auth/login`**: Inicia sesión un usuario existente.
    -   Cuerpo: `{ "email": "...", "password": "..." }`
    -   Devuelve: `{ "token": "...", "user": { ... } }`

## Rutas Protegidas

Las rutas bajo `/api/tasks` están protegidas por `authMiddleware`. Para acceder a ellas, incluye el JWT obtenido del inicio de sesión en la cabecera `Authorization`:

`Authorization: Bearer <tu_token_jwt>`

-   **`POST /api/tasks`**: Crea una nueva tarea (requiere autenticación).
    -   Cuerpo: `{ "title": "...", "description"?: "...", "status"?: "pending" | "in_progress" | "done" }`
-   **`GET /api/tasks`**: Obtiene las tareas para el usuario autenticado (requiere autenticación).

## Calidad de Código y Automatización

-   **ESLint:** Análisis estático de código para identificar patrones problemáticos.
    -   `npm run lint`: Comprueba errores de linting.
    -   `npm run lint:fix`: Corrige automáticamente los errores de linting.
-   **Prettier:** Formateador de código automatizado para un estilo consistente.
    -   `npm run prettier`: Comprueba problemas de formato.
    -   `npm run prettier:fix`: Corrige automáticamente los problemas de formato.
-   **Jest:** Framework de pruebas con una prueba básica de API que pasa.
    -   `npm test`: Ejecuta todas las pruebas.
-   **GitHub Actions:** Automatiza el linting, formateo y pruebas en eventos `push` y `pull_request`.
-   **Husky y lint-staged:** Hooks pre-commit para asegurar que los archivos en staging sean lintados y formateados automáticamente antes de hacer commit.