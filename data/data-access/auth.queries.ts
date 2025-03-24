import "server-only";

import { signIn } from "@/auth";
import { lower } from "@/data/helper/db-helper";
import db from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { VERIFICATION_TOKEN_EXP_MIN } from "@/lib/config/constants";
import { hashPassword } from "@/lib/utils/hash";
import { sendForgotPasswordEmail, sendVerificationEmail } from "@/lib/utils/resend";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
} from "@/lib/validator/auth-validtor";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";

// ******************************************************
// ************ oauthVerifyEmailAction ******************
// ******************************************************
export async function oauthVerifyEmailAction(email: string): Promise<ApiResponse<void>> {
  try {
    const schema = z.object({ email: z.string().email() });
    const validatedData = schema.parse({ email });

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.email, validatedData.email),
          isNull(users.hashedPassword),
          isNull(users.emailVerified),
        ),
      )
      .then((res) => res[0] ?? null);

    if (existingUser?.id) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, existingUser.id));
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ******************* signupQuery **********************
// ******************************************************
export async function signupQuery(
  input: unknown,
): Promise<ApiResponse<{ userId: string; message: string }>> {
  try {
    // Validate input with Zod
    const validatedInput = SignupSchema.parse(input);
    const { email, password, name } = validatedInput;

    // Input sanitization
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();

    // Validate password strength
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        success: false,
        error: {
          code: 400,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
      };
    }

    // Check for existing user
    const userResponse = await findUserByEmail(sanitizedEmail);
    if (!userResponse.success) {
      return {
        success: false,
        error: {
          code: 500,
          message: "Failed to check existing user",
        },
      };
    }

    const existingUser = userResponse.data;
    if (existingUser?.id) {
      // Handle OAuth account
      if (!existingUser.hashedPassword) {
        return {
          success: false,
          error: {
            code: 400,
            message:
              "This email is associated with a social login account. Please sign in with your social account.",
          },
        };
      }

      // Handle unverified email
      if (!existingUser.emailVerified && existingUser.email) {
        const tokenResponse = await createVerificationTokenAction(existingUser.email);
        if (!tokenResponse.success || !tokenResponse.data) {
          return {
            success: false,
            error: {
              code: 500,
              message: "Failed to create verification token",
            },
          };
        }
        await sendVerificationEmail(existingUser.email, tokenResponse.data.token);
        return {
          success: false,
          error: {
            code: 409,
            message:
              "Account exists but email not verified. A new verification email has been sent.",
          },
        };
      }

      // Handle existing verified account
      return {
        success: false,
        error: {
          code: 409,
          message: "An account with this email already exists. Please sign in instead.",
        },
      };
    }

    // Hash password
    // const hashedPassword = await argon2.hash(password, {
    //   type: argon2.argon2id,
    //   memoryCost: 65536,
    //   timeCost: 3,
    // });

    const hashedPassword = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        name: sanitizedName,
        email: sanitizedEmail,
        hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
      })
      .then((res) => res[0]);

    if (!newUser?.email) {
      return {
        success: false,
        error: {
          code: 500,
          message: "Failed to create user record",
        },
      };
    }

    const tokenResponse = await createVerificationTokenAction(newUser.email);
    if (!tokenResponse.success || !tokenResponse.data) {
      return {
        success: false,
        error: {
          code: 500,
          message: "Failed to create verification token",
        },
      };
    }
    await sendVerificationEmail(newUser.email, tokenResponse.data.token);

    return {
      success: true,
      data: {
        userId: newUser.id,
        message: "Account created successfully. Please check your email for verification.",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ******************* signinQuery **********************
// ******************************************************
export async function signinQuery(input: unknown): Promise<ApiResponse<{ message: string }>> {
  try {
    // Validate input with Zod
    const validatedInput = SigninSchema.parse(input);

    try {
      await signIn("credentials", { ...validatedInput, redirect: false });
      return {
        success: true,
        data: { message: "Successfully signed in" },
      };
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.type) {
          case "CredentialsSignin":
          case "CallbackRouteError":
            return {
              success: false,
              error: {
                code: 401,
                message: "Invalid credentials",
              },
            };
          case "AccessDenied":
            return {
              success: false,
              error: {
                code: 403,
                message: "Please verify your email, sign up again to resend verification email",
              },
            };
          case "OAuthAccountAlreadyLinked" as AuthError["type"]:
            return {
              success: false,
              error: {
                code: 409,
                message: "Login with your Google or Github account",
              },
            };
          default:
            return {
              success: false,
              error: {
                code: 500,
                message: "Oops. Something went wrong",
              },
            };
        }
      }
      throw err; // Re-throw unexpected errors
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ************* findVerificationTokenByToken ***********
// ******************************************************
export async function findVerificationTokenByToken(
  token: unknown,
): Promise<ApiResponse<typeof verificationTokens.$inferSelect | null>> {
  try {
    const schema = z.object({ token: z.string().min(1, "Token is required") });
    const validatedData = schema.parse({ token });

    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, validatedData.token))
      .then((res) => res[0] ?? null);

    return {
      success: true,
      data: verificationToken,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ******** deleteVerificationTokenByIdentifier *********
// ******************************************************
export async function deleteVerificationTokenByIdentifier(
  identifier: unknown,
): Promise<ApiResponse<void>> {
  try {
    const schema = z.object({
      identifier: z.string().email("Invalid email format"),
    });
    const validatedData = schema.parse({ identifier });

    await db
      .delete(verificationTokens)
      .where(eq(lower(verificationTokens.identifier), validatedData.identifier.toLowerCase()));

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *********** verifyCredentialsEmailAction ************
// ******************************************************
export async function verifyCredentialsEmailAction(
  token: unknown,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const schema = z.object({ token: z.string().min(1, "Token is required") });
    const validatedData = schema.parse({ token });

    // Get verification token
    const verificationTokenResponse = await findVerificationTokenByToken(validatedData.token);
    if (!verificationTokenResponse.success || !verificationTokenResponse.data) {
      return {
        success: false,
        error: {
          code: 404,
          message: "Invalid verification token",
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
          code: 410,
          message: "Verification token has expired",
        },
      };
    }

    // Find user
    const userResponse = await findUserByEmail(verificationToken.identifier);
    if (!userResponse.success || !userResponse.data) {
      return {
        success: false,
        error: {
          code: 404,
          message: "User not found",
        },
      };
    }

    const existingUser = userResponse.data;

    // Verify email if conditions are met
    if (!existingUser.emailVerified && existingUser.email === verificationToken.identifier) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, existingUser.id));

      await db
        .update(verificationTokens)
        .set({ expires: new Date() })
        .where(eq(verificationTokens.identifier, existingUser.email));

      return {
        success: true,
        data: { success: true },
      };
    }

    return {
      success: false,
      error: {
        code: 400,
        message: "Invalid verification attempt",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** findUserByEmail ********************
// ******************************************************
export async function findUserByEmail(
  email: unknown,
): Promise<ApiResponse<typeof users.$inferSelect | null>> {
  try {
    const schema = z.object({ email: z.string().email("Invalid email format") });
    const validatedData = schema.parse({ email });

    const user = await db
      .select()
      .from(users)
      .where(eq(lower(users.email), validatedData.email.toLowerCase()))
      .limit(1)
      .then((res) => res[0] ?? null);

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ********** createVerificationTokenAction ************
// ******************************************************
export async function createVerificationTokenAction(
  identifier: unknown,
): Promise<ApiResponse<{ token: string }>> {
  try {
    const schema = z.object({
      identifier: z.string().email("Invalid email format"),
    });
    const validatedData = schema.parse({ identifier });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXP_MIN * 60 * 1000);

    await db.insert(verificationTokens).values({
      identifier: validatedData.identifier.toLowerCase(),
      token,
      expires,
    });

    return {
      success: true,
      data: { token },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** forgotPasswordAction ****************
// ******************************************************

export async function forgotPasswordAction(input: unknown): Promise<ApiResponse<{ msg: string }>> {
  try {
    const validatedInput = ForgotPasswordSchema.parse(input);
    const email = validatedInput.email;

    try {
      const userResponse = await findUserByEmail(email);

      // this is a false positive, to deter malicious users
      if (!userResponse.success || !userResponse.data?.id) {
        return {
          success: true,
          data: { msg: "Password reset email sent." },
        };
      }

      const existingUser = userResponse.data;

      if (!existingUser.hashedPassword) {
        return {
          success: false,
          error: {
            code: 400,
            message: "This user was created with OAuth, please sign in with OAuth",
          },
        };
      }

      const verificationTokenResponse = await createVerificationTokenAction(existingUser.email);

      if (verificationTokenResponse.success && verificationTokenResponse.data) {
        await sendForgotPasswordEmail(existingUser.email, verificationTokenResponse.data.token);
      }

      return {
        success: true,
        data: { msg: "Password reset email sent." },
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: {
          code: 500,
          message: "Internal Server Error",
        },
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** resetPasswordAction ****************
// ******************************************************

export async function resetPasswordAction(
  email: (typeof users.$inferSelect)["email"],
  token: (typeof verificationTokens.$inferSelect)["token"],
  values: unknown,
): Promise<ApiResponse<void>> {
  try {
    const validatedValues = ResetPasswordSchema.parse(values);
    const password = validatedValues.password;

    const existingTokenResponse = await findVerificationTokenByToken(token);

    if (!existingTokenResponse.success || !existingTokenResponse.data) {
      // Delete expired token from the table
      await deleteVerificationTokenByIdentifier(email);
      return {
        success: false,
        error: {
          code: 400,
          message: "Token is invalid",
        },
      };
    }

    const existingToken = existingTokenResponse.data;

    if (new Date(existingToken.expires) < new Date()) {
      await deleteVerificationTokenByIdentifier(email);
      return {
        success: false,
        error: {
          code: 410,
          message: "Token is expired",
        },
      };
    }

    const existingUserResponse = await findUserByEmail(email);

    if (
      !existingUserResponse.success ||
      !existingUserResponse.data ||
      existingUserResponse.data.email.toLowerCase() !== existingToken.identifier
    ) {
      return {
        success: false,
        error: {
          code: 400,
          message: "Oops, something went wrong",
        },
      };
    }

    // const hashedPassword = await argon2.hash(password, {
    //   type: argon2.argon2id,
    //   memoryCost: 65536,
    //   timeCost: 3,
    // });

    const hashedPassword = await hashPassword(password);

    await db.update(users).set({ hashedPassword }).where(eq(users.email, email));
    await deleteVerificationTokenByIdentifier(email);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
