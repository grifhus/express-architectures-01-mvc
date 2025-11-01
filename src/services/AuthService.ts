import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "@config/data-source";
import { User } from "@data/entities/User";
import { RegisterUserDto } from "@http/dtos/RegisterUserDto";
import { LoginUserDto } from "@http/dtos/LoginUserDto";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
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

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; user: User }> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

    const token = sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "1h",
    });

    return { token, user };
  }
}
