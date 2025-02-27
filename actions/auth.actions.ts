"use server";

import "server-only";

import { handleAuthError, handleValidationError } from "@/lib/utils/error-handler";
import {
  forgotPasswordAction as forgotPasswordQuery,
  resetPasswordAction as resetPasswordQuery,
  signinQuery,
  signupQuery,
  verifyCredentialsEmailAction,
} from "@/lib/data-access/auth-queries";
import { ForgotPasswordSchema, ResetPasswordSchema, SigninSchema, SignupSchema } from "@/lib/validator/auth-validtor";

// Define action result types
export type ActionResult = {
  success: boolean;
  message?: string;
  error?: {
    validationErrors?: Record<string, string[]>;
    serverError?: {
      message: string;
      code?: string;
    };
  };
};

// Signup action
export async function signupAction(formData: FormData): Promise<ActionResult> {
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
            code: "SIGNUP_FAILED",
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
export async function signinAction(formData: FormData): Promise<ActionResult> {
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
            code: "SIGNIN_FAILED",
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
export async function forgotPasswordAction(input: FormData | { email: string }): Promise<ActionResult> {
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
    const { success, data, error } = await forgotPasswordQuery(validationResult.data);
    if (!success) {
      return {
        success: false,
        error: {
          serverError: {
            message: error?.message || "Failed to send password reset email",
            code: "FORGOT_PASSWORD_FAILED",
          },
        },
      };
    }

    return {
      success: true,
      message: data?.data?.msg || "Password reset email sent successfully",
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
): Promise<ActionResult> {
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
            code: "RESET_PASSWORD_FAILED",
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
export async function verifyEmailAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const token = formData.get("token");
    if (!token || typeof token !== "string") {
      return {
        success: false,
        error: {
          serverError: {
            message: "Invalid verification token",
            code: "INVALID_TOKEN",
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
            code: "VERIFY_EMAIL_FAILED",
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
