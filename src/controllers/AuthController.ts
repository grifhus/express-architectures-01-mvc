import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { AuthService } from "@services/AuthService";
import { RegisterUserDto } from "@dtos/RegisterUserDto";
import { LoginUserDto } from "@dtos/LoginUserDto";

/**
 * Controller for handling authentication requests.
 * It is decorated with @injectable() to allow tsyringe to manage its lifecycle and dependencies.
 */
@injectable()
export class AuthController {
  /**
   * The constructor receives an instance of AuthService through dependency injection.
   * @param authService The authentication service.
   */
  constructor(private authService: AuthService) {}

  /**
   * Handles user registration requests.
   * Validates the request body, calls the AuthService to register the user,
   * and sends back the new user's details (without password).
   * @param req The Express request object, containing the registration data in the body.
   * @param res The Express response object.
   * @returns A Promise that resolves when the response is sent.
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerUserDto = plainToClass(RegisterUserDto, req.body);
      const errors = await validate(registerUserDto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const user = await this.authService.register(registerUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  /**
   * Handles user login requests.
   * Validates the request body, calls the AuthService to authenticate the user,
   * and sends back a JWT token and the user's details (without password).
   * @param req The Express request object, containing the login credentials in the body.
   * @param res The Express response object.
   * @returns A Promise that resolves when the response is sent.
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginUserDto = plainToClass(LoginUserDto, req.body);
      const errors = await validate(loginUserDto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const { token, user } = await this.authService.login(loginUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
}
