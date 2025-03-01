import { ActionResponse } from "@/types/api";

/**
 * Generic error handler for authentication actions
 * @param error - The error object caught in the try-catch block
 * @param context - The context where the error occurred (e.g., "signin", "signup")
 * @returns ActionResponse with formatted error message and code
 */
export const handleAuthError = <T>(error: unknown, context: string): ActionResponse<T> => {
    // Log the error for monitoring
    console.error(`[Auth Error - ${context}]`, error);

    // Handle known error types
    if (error instanceof Error) {
        return {
            success: false,
            error: {
                serverError: {
                    message: error.message,
                    code: 500,
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
                code: 500,
            },
        },
    };
};

/**
 * Creates a validation error result
 * @param fieldErrors - Object containing field-specific validation errors
 * @returns ActionResponse with validation errors
 */
export const handleValidationError = <T>(
    fieldErrors: Record<string, string[]>
): ActionResponse<T> => {
    // Convert field errors to ValidationError array
    const validationErrors = Object.entries(fieldErrors).flatMap(([field, messages]) =>
        messages.map(message => ({ field, message }))
    );

    return {
        success: false,
        error: {
            serverError: {
                message: "Validation failed",
                code: 400,
            },
            validationErrors,
        },
    };
};