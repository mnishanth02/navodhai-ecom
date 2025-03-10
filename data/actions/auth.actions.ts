"use server";

import { actionClient } from "@/lib/utils/safe-action";
import { z } from "zod";
import {
  forgotPasswordAction as forgotPasswordQuery,
  resetPasswordAction as resetPasswordQuery,
  signinQuery,
  signupQuery,
  verifyCredentialsEmailAction,
} from "@/data/data-access/auth.queries";
import { ForgotPasswordSchema, SigninSchema, SignupSchema } from "@/lib/validator/auth-validtor";
import { ActionError } from "@/lib/error";

// Signup action
export const signup = actionClient
  .metadata({
    actionName: "signup",
    requiresAuth: false
  })
  .schema(SignupSchema)
  .action(async ({ parsedInput }) => {
    const result = await signupQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create account");
    }

    return {
      userId: result.data?.userId,
      message: result.data?.message || "Account created successfully"
    };
  });

// Signin action
export const signin = actionClient
  .metadata({
    actionName: "signin",
    requiresAuth: false
  })
  .schema(SigninSchema)
  .action(async ({ parsedInput }) => {
    const result = await signinQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to sign in");
    }

    return {
      message: result.data?.message || "Successfully signed in"
    };
  });

// Forgot password action
export const forgotPassword = actionClient
  .metadata({
    actionName: "forgotPassword",
    requiresAuth: false
  })
  .schema(ForgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const result = await forgotPasswordQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to send password reset email");
    }

    return {
      message: result.data?.msg || "Password reset email sent successfully"
    };
  });

// Reset password action
export const resetPassword = actionClient
  .metadata({
    actionName: "resetPassword",
    requiresAuth: false
  })
  .schema(z.object({
    email: z.string().email("Invalid email format"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }))
  .action(async ({ parsedInput }) => {
    const { email, token, password } = parsedInput;

    const result = await resetPasswordQuery(email, token, { password });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to reset password");
    }

    return {
      message: "Password reset successfully"
    };
  });

// Email verification action
export const verifyEmail = actionClient
  .metadata({
    actionName: "verifyEmail",
    requiresAuth: false
  })
  .schema(z.object({
    token: z.string().min(1, "Token is required")
  }))
  .action(async ({ parsedInput }) => {
    const { token } = parsedInput;

    const result = await verifyCredentialsEmailAction(token);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to verify email");
    }

    return {
      message: "Email verified successfully"
    };
  });
