"use server";

import "server-only";

import {
  deleteVerificationTokenByIdentifier,
  findVerificationTokenByToken,
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
      return {
        success: false,
        error: {
          validationErrors: validationResult.error.flatten().fieldErrors,
        },
      };
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
    console.error("[Signup Error]", error);
    return {
      success: false,
      error: {
        serverError: {
          message: error instanceof Error ? error.message : "An unexpected error occurred during signup",
          code: "INTERNAL_ERROR",
        },
      },
    };
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
      return {
        success: false,
        error: {
          validationErrors: validationResult.error.flatten().fieldErrors,
        },
      };
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
    console.error("[Signin Error]", error);
    return {
      success: false,
      error: {
        serverError: {
          message: error instanceof Error ? error.message : "An unexpected error occurred during signin",
          code: "INTERNAL_ERROR",
        },
      },
    };
  }
}

// Forgot password action
export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    // Parse form data into an object
    const rawFormData = {
      email: formData.get("email"),
    };

    // Validate input
    const validationResult = ForgotPasswordSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return {
        success: false,
        error: {
          validationErrors: validationResult.error.flatten().fieldErrors,
        },
      };
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
      message: data?.data.msg || "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    return {
      success: false,
      error: {
        serverError: {
          message:
            error instanceof Error ? error.message : "An unexpected error occurred during password reset request",
          code: "INTERNAL_ERROR",
        },
      },
    };
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
      return {
        success: false,
        error: {
          validationErrors: validationResult.error.flatten().fieldErrors,
        },
      };
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
    console.error("[Reset Password Error]", error);
    return {
      success: false,
      error: {
        serverError: {
          message: error instanceof Error ? error.message : "An unexpected error occurred during password reset",
          code: "INTERNAL_ERROR",
        },
      },
    };
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

    // Find verification token
    const verificationTokenResponse = await findVerificationTokenByToken(token);
    if (!verificationTokenResponse.success || !verificationTokenResponse.data) {
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

    const verificationToken = verificationTokenResponse.data;

    // Check if token is expired
    if (
      !verificationToken.expires ||
      new Date(verificationToken.expires) < new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      return {
        success: false,
        error: {
          serverError: {
            message: "Verification token has expired",
            code: "TOKEN_EXPIRED",
          },
        },
      };
    }

    // Verify email
    const verifyResult = await verifyCredentialsEmailAction(token);
    if (!verifyResult.success) {
      return {
        success: false,
        error: {
          serverError: {
            message: "Failed to verify email",
            code: "VERIFICATION_FAILED",
          },
        },
      };
    }

    // Delete verification token
    await deleteVerificationTokenByIdentifier(verificationToken.identifier);

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("[Email Verification Error]", error);
    return {
      success: false,
      error: {
        serverError: {
          message: error instanceof Error ? error.message : "An unexpected error occurred during email verification",
          code: "INTERNAL_ERROR",
        },
      },
    };
  }
}
