import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@controllers/AuthController";

/**
 * Express router for authentication-related routes.
 * @remarks
 * This router handles user registration and login.
 */
const router = Router();

/**
 * Resolves the AuthController instance from the tsyringe dependency injection container.
 */
const authController = container.resolve(AuthController);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       201:
 *         description: The user was successfully created.
 *       400:
 *         description: Bad request.
 */
router.post("/register", (req, res) => authController.register(req, res));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       200:
 *         description: The user was successfully logged in.
 *       401:
 *         description: Unauthorized.
 */
router.post("/login", (req, res) => authController.login(req, res));

export default router;
