import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user.
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user.
 */
export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
