import { ActionResult } from "@/actions/auth.actions";

/**
 * Generic error handler for authentication actions
 * @param error - The error object caught in the try-catch block
 * @param context - The context where the error occurred (e.g., "signin", "signup")
 * @returns ActionResult with formatted error message and code
 */
export const handleAuthError = (error: unknown, context: string): ActionResult => {
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
export const handleValidationError = (
    fieldErrors: Record<string, string[]>
): ActionResult => ({
    success: false,
    error: {
        validationErrors: fieldErrors,
    },
});