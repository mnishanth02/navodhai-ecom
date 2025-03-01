import { ActionResult } from "@/types/api";
import { z } from "zod";

// Simple validation error type
type ValidationError = {
  field: string;
  message: string;
}[];

// Simple API response type
export type ApiResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    validationErrors?: ValidationError;
  };
};

// Main validation and execution helper
export async function validateAndExecute<T extends z.ZodType, R>(
  schema: T,
  input: unknown,
  executor: (validatedData: z.infer<T>) => Promise<R | void>
): Promise<ApiResponse<R>> {
  try {
    // Validate input
    const validationResult = schema.safeParse(input);

    if (!validationResult.success) {
      // Handle validation errors
      const validationErrors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return createError("Validation failed", "VALIDATION_ERROR", validationErrors);
    }

    // Execute business logic
    const result = await executor(validationResult.data);

    // Handle void or undefined returns
    if (result === undefined || result === null) {
      return createSuccess();
    }

    // Handle successful result
    return createSuccess(result);
  } catch (error) {
    // Handle execution errors
    console.error("Execution error:", error);
    return createError(error instanceof Error ? error.message : "Operation failed", "EXECUTION_ERROR");
  }
}


// Simple error creator
const createError = <T>(message: string, code: string, validationErrors?: ValidationError): ApiResponse<T> => ({
  success: false,
  error: {
    message,
    code,
    ...(validationErrors && { validationErrors }),
  },
});

// Simple success creator
const createSuccess = <T>(data?: T): ApiResponse<T> => ({
  success: true,
  ...(data !== undefined && { data }),
});


// Create action response
export const createActionResponse = <T>(success: boolean, data?: T, message?: string): ActionResult => ({
  success,
  ...(data !== undefined && { data }),
  ...(message !== undefined && { message }),
});
