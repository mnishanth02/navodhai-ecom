import { ActionResult } from "@/types/api";

/**
 * Generic error handler for authentication actions
 * @param error - The error object caught in the try-catch block
 * @param context - The context where the error occurred (e.g., "signin", "signup")
 * @returns ActionResult with formatted error message and code
 */
export const handleAuthError = <T>(error: unknown, context: string): ActionResult<T> => {
    // Log the error for monitoring
    console.error(`[Auth Error - ${context}]`, error);

    // Handle known error types
    if (error instanceof Error) {
        return {
            success: false,
            error: {
                serverError: {
                    message: error.message,
                    code: `${context.toUpperCase()}_ERROR`,
                },
            },
        };
    }

    // Handle unknown errors
    return {
        success: false,
        error: {
            serverError: {
                message: `An unexpected error occurred during ${context}`,
                code: "INTERNAL_ERROR",
            },
        },
    };
};

/**
 * Creates a validation error result
 * @param fieldErrors - Object containing field-specific validation errors
 * @returns ActionResult with validation errors
 */
export const handleValidationError = <T>(
    fieldErrors: Record<string, string[]>
): ActionResult<T> => ({
    success: false,
    error: {
        validationErrors: fieldErrors,
    },
});