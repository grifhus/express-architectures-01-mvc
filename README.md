# Proyecto Base para Arquitecturas Express + TypeScript

[English](README.en.md) | [Español](README.md)

Este proyecto sirve como una base robusta para implementar varios patrones arquitectónicos usando Express.js y TypeScript. Incluye configuraciones esenciales, configuración de base de datos con TypeORM, autenticación JWT y comprobaciones automatizadas de calidad de código.

## Table of Contents
- [Development Journal](DEVELOPMENT_JOURNAL.md)
- [Paradigmas de Programación (POO vs. Funcional)](src/docs/PARADIGMS.md)
- [Documentación de Dependencias](src/docs/DEPENDENCIES.md)
- [Arquitectura MVC](#arquitectura-mvc)
- [Features](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instrucciones de Configuración](#instrucciones-de-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Migraciones de Base de Datos](#migraciones-de-base-de-datos)
- [Autenticación (JWT)](#autenticación-jwt)
- [Rutas Protegidas](#rutas-protegidas)
- [Calidad de Código y Automatización](#calidad-de-código-y-automatización)

## Arquitectura MVC

Este proyecto sigue el patrón de arquitectura Model-View-Controller (MVC), adaptado para una API REST. A continuación, se describe cómo se mapean los componentes del proyecto a los elementos de MVC:

### Model (Modelo)
El Modelo es responsable de la lógica de negocio y la gestión de datos. En este proyecto, el Modelo se compone de:
-   **Modelos (`src/models`)**: Contiene las entidades de TypeORM (`Task.ts`, `User.ts`) que definen la estructura de los datos y su relación con la base de datos.
-   **Servicios (`src/services`)**: Contienen la lógica de negocio principal, interactuando con los modelos y la base de datos para realizar operaciones.

### View (Vista)
En una API REST, la "Vista" no es una interfaz de usuario gráfica, sino la representación de los datos que se envían al cliente. En este proyecto, la Vista se gestiona a través de:
-   **DTOs (Data Transfer Objects) (`src/dtos`)**: Utilizados para validar la entrada de datos de las solicitudes y para estructurar la salida de datos de las respuestas, asegurando que los datos se presenten de forma consistente y validada.

### Controller (Controlador)
El Controlador actúa como intermediario entre el Modelo y la Vista, manejando las solicitudes del usuario, interactuando con el Modelo y seleccionando la Vista adecuada para la respuesta. En este proyecto, los Controladores se encuentran en:
-   **Controladores (`src/controllers`)**: Reciben las solicitudes HTTP, validan los datos de entrada (usando DTOs), invocan la lógica de negocio en los Servicios (Modelo) y preparan las respuestas HTTP.
-   **Rutas (`src/routes`)**: Definen los endpoints de la API y dirigen las solicitudes a los Controladores correspondientes.

## Inyección de Dependencias con tsyringe

Este proyecto utiliza `tsyringe` para la inyección de dependencias (DI). La DI nos ayuda a escribir código más limpio, modular y fácil de probar al desacoplar las clases de sus dependencias.

-   **`@injectable()`**: Las clases que pueden ser inyectadas (como servicios y controladores) están decoradas con `@injectable()`.
-   **Inyección por Constructor**: Las dependencias se inyectan en el constructor de la clase.
-   **Contenedor**: `tsyringe` utiliza un contenedor para resolver las dependencias. En las rutas, el contenedor se utiliza para obtener una instancia de los controladores.

## Manejo de Errores Mejorado

El proyecto utiliza un sistema de manejo de errores centralizado con clases de error personalizadas que se encuentran en `src/utils/errors.ts`. Esto permite lanzar errores más específicos y descriptivos desde la lógica de negocio (por ejemplo, `NotFoundError`, `BadRequestError`), que luego son manejados por el `ErrorHandler` global para enviar respuestas HTTP consistentes.

## Configuración Centralizada

La configuración de la aplicación se centraliza en `src/config/index.ts`. Este archivo carga las variables de entorno desde el archivo `.env` y las exporta en un objeto `config` cohesivo. Esto facilita la gestión de la configuración en diferentes entornos y evita el uso de `process.env` en todo el código.

## Características
- Servidor Express.js con TypeScript (definición de la aplicación separada del inicio del servidor)
- Inyección de Dependencias con `tsyringe`
- Integración de base de datos PostgreSQL a través de TypeORM
- Autenticación basada en JWT (JSON Web Token)
- Funcionalidad de registro e inicio de sesión de usuarios
- Rutas de API protegidas (por ejemplo, para tareas)
- Objetos de Transferencia de Datos (DTOs) con `class-validator` para la validación de solicitudes
- Middleware centralizado de manejo de errores global con clases de error personalizadas
- Gestión de variables de entorno centralizada con `dotenv` y un objeto de configuración
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
- `tsyringe` (Inyección de Dependencias)
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
    Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` y rellena tus datos. La configuración ahora se gestiona de forma centralizada en `src/config/index.ts`.
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

## Documentación de Código Fuente (TypeDoc)

Este proyecto utiliza TypeDoc para generar documentación HTML interactiva directamente desde los comentarios TSDoc en el código fuente. Esto es invaluable para entender la estructura del código, las clases, métodos y sus funcionalidades, especialmente en un proyecto de aprendizaje.

1.  **Generar la Documentación:**
    ```bash
    npm run build:docs
    ```
    Esto creará una carpeta `docs/api` en la raíz del proyecto con la documentación HTML generada.

2.  **Ver la Documentación:**
    Abre el archivo `docs/api/index.html` en tu navegador web para explorar la documentación interactiva.