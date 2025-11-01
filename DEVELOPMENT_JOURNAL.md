# Diario de Desarrollo: Creación del `base-project`

[English](DEVELOPMENT_JOURNAL.en.md) | [Español](DEVELOPMENT_JOURNAL.md)

Este documento narra el proceso de creación, depuración y refinamiento del `base-project`, que servirá como plantilla para los proyectos de arquitecturas de software.

## Fase 1: Planificación Inicial y Alcance

El objetivo inicial era crear un proyecto base con Express y TypeScript para evitar la repetitividad al construir 7 arquitecturas diferentes. El stack tecnológico inicial incluía TypeORM, PostgreSQL, Jest, ESLint y Prettier.

### Decisiones Clave de Mejora:

Se propuso enriquecer el proyecto base con características profesionales para que no fuera solo un "hola mundo", sino una base sólida y escalable. Las adiciones clave acordadas fueron:

1.  **Migraciones de Base de Datos:** Usar el CLI de TypeORM para versionar el esquema de la base de datos.
2.  **Seguridad:** Añadir `helmet` para cabeceras de seguridad y `jsonwebtoken` para autenticación.
3.  **Automatización de Calidad:** Implementar `husky` y `lint-staged` para ejecutar chequeos de calidad antes de cada commit.
4.  **Integración Continua (CI):** Añadir un workflow de GitHub Actions para ejecutar pruebas y linters automáticamente.
5.  **Manejo de Errores Centralizado:** Crear un middleware global para manejar errores.
6.  **Pruebas Unitarias Base:** Añadir una prueba inicial para validar la configuración de Jest.

## Fase 2: Implementación y Depuración

Esta fase fue la más intensiva, donde construimos el proyecto y nos enfrentamos a varios problemas del mundo real.

### 1. Creación de Entidades y Migraciones

-   **Acción:** Se crearon las entidades `User` y `Task` con TypeORM y se procedió a generar la migración inicial.
-   **Problema 1: Error de Sintaxis en `package.json`**
    -   **Síntoma:** `npm install` fallaba con un error `EJSONPARSE`.
    -   **Causa:** Las comillas dentro de los scripts `prettier` estaban mal formateadas, invalidando el JSON.
    -   **Solución:** Se corrigió la sintaxis de las comillas en `package.json`.
-   **Problema 2: Fallo en la Generación de Migración (Argumentos)**
    -   **Síntoma:** `npm run migration:generate` fallaba con `Missing required argument: dataSource`.
    -   **Causa:** `npm` no estaba pasando los argumentos correctamente al script de `typeorm`.
    -   **Solución:** Se modificó el script en `package.json` para usar `--` (ej: `npm run typeorm -- migration:generate ...`), que es la forma correcta de pasar argumentos a sub-scripts.
-   **Problema 3: Fallo en la Conexión a la Base de Datos**
    -   **Síntoma:** Errores de autenticación (`password authentication failed`) y de resolución de host (`getaddrinfo ENOTFOUND`).
    -   **Causa:** Las credenciales y el host en el archivo `.env` del usuario no eran correctos.
    -   **Solución:** Se añadió código de depuración (`console.log`) temporalmente en `data-source.ts` para que el usuario pudiera ver qué valores se estaban usando y corregir su archivo `.env`.
-   **Problema 4: Migraciones Duplicadas**
    -   **Síntoma:** `npm run migration:run` fallaba con `type "tasks_status_enum" already exists`.
    -   **Causa:** Múltiples intentos fallidos de generar la migración habían creado varios archivos de migración en la carpeta `src/data/migrations`. Al ejecutar `migration:run`, el primero tenía éxito y el segundo fallaba al intentar crear lo mismo.
    -   **Solución:** Se eliminaron todos los archivos de migración existentes, se pidió al usuario que limpiara la base de datos manualmente por última vez, se generó una única y nueva migración, y finalmente `npm run migration:run` se ejecutó con éxito.

### 2. Implementación de Autenticación JWT

-   **Acción:** Se implementó un flujo de autenticación completo.
-   **Librerías y Justificación:**
    -   `bcryptjs`: Estándar de la industria para el hasheo seguro de contraseñas. Es crucial nunca guardar contraseñas en texto plano.
    -   `jsonwebtoken`: La librería más popular para crear y verificar JSON Web Tokens.
-   **Componentes Creados:** `AuthService` (lógica), `AuthController` (manejo de peticiones), `AuthRoutes` (rutas), y DTOs (`RegisterUserDto`, `LoginUserDto`) para validación.

### 3. Verificación y Pulido Final

-   **Problema 5: Fallo de Compilación (`npm run build`) por Alias de Ruta**
    -   **Síntoma:** `tsc` no podía resolver importaciones como `@config/...`.
    -   **Causa:** Aunque los alias estaban definidos en `tsconfig.json`, las importaciones en los archivos usaban rutas relativas (`../../...`).
    -   **Solución:** Se refactorizaron todas las importaciones para usar los alias de ruta, haciendo el código más limpio y mantenible.
-   **Problema 6: Fallo en Pruebas (`npm test`) por `SyntaxError` (`import` en `.js`)**
    -   **Síntoma:** Las pruebas fallaban porque Jest no transpilaba `jest.setup.js`.
    -   **Causa:** Jest no procesaba archivos `.js` con sintaxis TypeScript.
    -   **Solución:** Se renombró `jest.setup.js` a `jest.setup.ts` y se actualizó la configuración de Jest en `package.json` para reflejar esto.
-   **Problema 7: Fallo en Pruebas (`npm test`) por `EADDRINUSE`**
    -   **Síntoma:** Las pruebas fallaban porque el puerto `3000` ya estaba en uso.
    -   **Causa:** El archivo `index.ts` iniciaba el servidor al ser importado por Jest, causando un conflicto con el servidor de pruebas de `supertest`.
    -   **Solución:** Se refactorizó el código separando la definición de la aplicación en `src/app.ts` y el arranque del servidor en `src/index.ts`. Esta es una práctica estándar para permitir que las pruebas importen la aplicación de forma segura.
-   **Problema 8: Fallo en Desarrollo (`npm run dev`) por Alias de Ruta**
    -   **Síntoma:** `npm run dev` fallaba porque `ts-node-dev` no resolvía los alias de ruta.
    -   **Causa:** `ts-node-dev` no entendía los alias como `@config/...`.
    -   **Solución:** Se instaló y configuró `tsconfig-paths` para integrarlo con `ts-node-dev`.
-   **Problema 9: Fallo en Producción (`npm start`) por Alias de Ruta**
    -   **Síntoma:** El código compilado en `dist/` no podía resolver los alias de ruta, incluso después de las correcciones anteriores.
    -   **Causa:** `tsc` compila a JS pero no reemplaza los alias. `module-alias` se estaba importando demasiado tarde.
    -   **Solución:** Se instaló y configuró `module-alias`. La línea `import 'module-alias/register';` se movió a la primera línea de `src/index.ts` para asegurar que se activara antes de cualquier intento de resolver alias.

-   **Problema 10: Fallo del Workflow de GitHub Actions (Linting/Formato)**
    -   **Síntoma:** El workflow lanzado por los `push` fallaba con errores de Prettier y ESLint.
    -   **Causa:** El `ci.yml` no incluía la rama `master`. Además, ESLint reportaba `'_next' is defined but never used` a pesar de renombrar el parámetro.
    -   **Solución:** Se actualizó `ci.yml` para incluir `master`. Se configuró el archivo `.eslintrc.js` para que la regla `@typescript-eslint/no-unused-vars` permitiera explícitamente parámetros que comienzan con guion bajo (`_`).

-   **Problema 11: El Hook `pre-commit` de Husky no Bloqueaba los Commits**
    -   **Síntoma:** Los commits se realizaban con éxito incluso con errores de linting, y `lint-staged` reportaba "could not find any staged files."
    -   **Causa:** El script original `.husky/pre-commit` era específico de shell (`sh`) y `lint-staged` no estaba detectando correctamente los archivos staged en el entorno de Windows/PowerShell.
    -   **Solución:** El script `.husky/pre-commit` fue modificado para ejecutar directamente `npm run lint:fix` y `npm run prettier:fix`. Esto asegura que todos los archivos `.ts` en el directorio `src` sean linted y formateados antes de cada commit, independientemente del comportamiento de `lint-staged`.

## Fase 3: Estrategia de Repositorios

Se discutieron varias estrategias sobre cómo organizar los proyectos en Git:

1.  **Monorepo:** Un solo repositorio para todos los proyectos. Se descartó por la complejidad añadida de herramientas como Nx o Turborepo, que nos distraería del objetivo principal.
2.  **Git Submodules:** Un repositorio principal con "enlaces" a sub-repositorios. Se descartó por ser una característica notoriamente compleja y difícil de manejar.
3.  **Multi-repo (Opción Elegida):** Un repositorio separado e independiente para cada proyecto. Se concluyó que esta era la opción más limpia, simple y didáctica para nuestro objetivo de aprender y comparar arquitecturas de forma aislada.

## Estado Final del `base-project`

El proyecto base se encuentra en un estado completo, verificado y profesional. Incluye una base de código funcional, un sistema de autenticación, manejo de base de datos con migraciones, y un robusto conjunto de herramientas para garantizar la calidad y la automatización del código. Está listo para ser versionado y clonado para los siguientes proyectos.
