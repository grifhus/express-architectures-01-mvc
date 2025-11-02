import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "@utils/errors";

/**
 * Factory function that creates a validation middleware for a given DTO class.
 * This middleware uses `class-transformer` to transform the request body into an instance of the DTO
 * and `class-validator` to validate its properties.
 * If validation fails, it throws a `BadRequestError` with aggregated error messages.
 * If validation succeeds, it attaches the validated DTO instance to `req.body` and proceeds to the next middleware.
 * @param dtoClass The DTO class to validate the request body against.
 * @returns An Express middleware function.
 */
export const validateDto = (dtoClass: new (...args: unknown[]) => object) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Transform the plain request body object into an instance of the DTO class
    const dto = plainToClass(dtoClass, req.body);
    // Validate the DTO instance against its defined validation rules
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      // Aggregate all validation error messages into a single string
      const errorMessages = errors
        .map((error: ValidationError) => Object.values(error.constraints || {}))
        .join(", ");
      // Pass a BadRequestError to the next error handling middleware
      return next(new BadRequestError(errorMessages));
    }

    // If validation succeeds, replace the request body with the validated DTO instance
    // This ensures type safety and consistency in subsequent middleware/handlers
    req.body = dto;
    next();
  };
};
