import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
