"use server";

import { handleAuthError, handleValidationError } from "@/lib/utils/action-handler";
import {
  forgotPasswordAction as forgotPasswordQuery,
  resetPasswordAction as resetPasswordQuery,
  signinQuery,
  signupQuery,
  verifyCredentialsEmailAction,
} from "@/lib/data-access/auth-queries";
import { ForgotPasswordSchema, ResetPasswordSchema, SigninSchema, SignupSchema } from "@/lib/validator/auth-validtor";
import { ActionResponse } from "@/types/api";
import { users } from "@/drizzle/schema";


// Signup action
export async function signupAction(formData: FormData): Promise<ActionResponse<typeof users.$inferSelect>> {
  try {
    // Parse form data into an object
    const rawFormData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate input
    const validationResult = SignupSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.flatten().fieldErrors);
    }

    // Call signup query
    const result = await signupQuery(validationResult.data);
    if (!result.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: result.error?.message || "Failed to create account",
            code: 500,
          },
        },
      };
    }

    return {
      success: true,
      message: result.data?.message || "Account created successfully",
    };
  } catch (error) {
    return handleAuthError(error, "signup");
  }
}

// Signin action
export async function signinAction(formData: FormData): Promise<ActionResponse<typeof users.$inferSelect>> {
  try {
    // Parse form data into an object
    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate input
    const validationResult = SigninSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.flatten().fieldErrors);
    }

    // Call signin query
    const result = await signinQuery(validationResult.data);
    if (!result.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: result.error?.message || "Failed to sign in",
            code: 500,
          },
        },
      };
    }

    return {
      success: true,
      message: result.data?.message || "Successfully signed in",
    };
  } catch (error) {
    return handleAuthError(error, "signin");
  }
}

// Forgot password action
export async function forgotPasswordAction(input: FormData | { email: string }): Promise<ActionResponse<typeof users.$inferSelect>> {
  try {
    // Parse input into an object
    const rawFormData = input instanceof FormData
      ? { email: input.get("email") }
      : input;

    // Validate input
    const validationResult = ForgotPasswordSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.flatten().fieldErrors);
    }

    // Call forgot password query
    const result = await forgotPasswordQuery(validationResult.data);
    if (!result.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: result.error?.message || "Failed to send password reset email",
            code: 500,
          },
        },
      };
    }

    return {
      success: true,
      message: result.data?.msg || "Password reset email sent successfully",
    };
  } catch (error) {
    return handleAuthError(error, "forgot_password");
  }
}

// Reset password action
export async function resetPasswordAction(
  email: string,
  token: string,
  values: unknown
): Promise<ActionResponse<typeof users.$inferSelect>> {
  try {
    // Validate input
    const validationResult = ResetPasswordSchema.safeParse(values);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.flatten().fieldErrors);
    }

    // Call reset password query
    const result = await resetPasswordQuery(email, token, validationResult.data);

    if (!result.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: result.error?.message || "Failed to reset password",
            code: 500,
          },
        },
      };
    }

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    return handleAuthError(error, "reset_password");
  }
}

// Email verification action
export async function verifyEmailAction(prevState: ActionResponse<typeof users.$inferSelect> | null, formData: FormData): Promise<ActionResponse<typeof users.$inferSelect>> {
  try {
    const token = formData.get("token");
    if (!token || typeof token !== "string") {
      return {
        success: false,
        error: {
          serverError: {
            message: "Invalid verification token",
            code: 400,
          },
        },
      };
    }

    const result = await verifyCredentialsEmailAction(token);
    if (!result.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: result.error?.message || "Failed to verify email",
            code: 500,
          },
        },
      };
    }

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    return handleAuthError(error, "verify_email");
  }
}
