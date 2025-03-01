// Define action result types
export type ActionResult<T> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        validationErrors?: Record<string, string[]>;
        serverError?: {
            message: string;
            code?: string;
        };
    };
};
