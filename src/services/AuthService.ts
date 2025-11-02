import { config } from "@config/index";
import { injectable } from "tsyringe";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "@config/data-source";
import { User } from "@models/User";
import { RegisterUserDto } from "@dtos/RegisterUserDto";
import { LoginUserDto } from "@dtos/LoginUserDto";
import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
} from "@utils/errors";

/**
 * Service for handling authentication logic.
 * It is decorated with @injectable() to allow tsyringe to manage its lifecycle.
 */
@injectable()
export class AuthService {
  /**
   * The TypeORM repository for User entities.
   * @private
   */
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Registers a new user in the system.
   * Hashes the password before saving the user to the database.
   * @param registerUserDto Data transfer object containing user registration details.
   * @returns A Promise that resolves with the newly created User entity.
   * @throws {BadRequestError} If a user with the provided email already exists.
   */
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * Authenticates a user and generates a JSON Web Token (JWT).
   * @param loginUserDto Data transfer object containing user login credentials.
   * @returns A Promise that resolves with an object containing the JWT and the authenticated User entity.
   * @throws {UnauthorizedError} If the email or password is invalid.
   * @throws {InternalServerError} If the JWT secret is not configured.
   */
  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; user: User }> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const jwtSecret = config.jwt.secret;
    if (!jwtSecret) {
      throw new InternalServerError("JWT secret is not defined");
    }

    const token = sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "1h",
    });

    return { token, user };
  }
}
