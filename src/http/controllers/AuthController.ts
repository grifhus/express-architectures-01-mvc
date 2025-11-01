import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { AuthService } from "../../services/AuthService";
import { RegisterUserDto } from "../dtos/RegisterUserDto";
import { LoginUserDto } from "../dtos/LoginUserDto";

export class AuthController {
  private authService = new AuthService();

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
