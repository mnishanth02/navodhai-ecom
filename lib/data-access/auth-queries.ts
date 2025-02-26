import "server-only";

import { VERIFICATION_TOKEN_EXP_MIN } from "../config/constants";
import { lower } from "../db-helper";
import { ApiResponse, validateAndExecute } from "../helper";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../resend";
import { ForgotPasswordSchema, SigninSchema, SignupSchema } from "../validator/auth-validtor";
import { signIn } from "@/auth";
import db from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import argon2 from "argon2";
import { and, eq, isNull } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";

// ******************************************************
// ************ oauthVerifyEmailAction ******************
// ******************************************************
export async function oauthVerifyEmailAction(email: string): Promise<ApiResponse<void>> {
  return validateAndExecute(z.object({ email: z.string().email() }), { email }, async (parsedInput) => {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, parsedInput.email), isNull(users.hashedPassword), isNull(users.emailVerified)))
      .then((res) => res[0] ?? null);

    if (existingUser?.id) {
      await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, existingUser.id));
    }
  });
}

// ******************************************************
// ******************* signupQuery **********************
// ******************************************************
export async function signupQuery(input: unknown): Promise<ApiResponse<{ userId: string; message: string }>> {
  return validateAndExecute(SignupSchema, input, async (parsedInput) => {
    const { email, password, name } = parsedInput;

    // Input sanitization
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();

    // Validate password strength
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter, one lowercase letter, and one number");
    }

    // Check for existing user
    const userResponse = await findUserByEmail(sanitizedEmail);
    if (!userResponse.success) {
      throw new Error("Failed to check existing user");
    }

    const existingUser = userResponse.data;
    if (existingUser?.id) {
      // Handle OAuth account
      if (!existingUser.hashedPassword) {
        throw new Error(
          "This email is associated with a social login account. Please sign in with your social account."
        );
      }

      // Handle unverified email
      if (!existingUser.emailVerified && existingUser.email) {
        const tokenResponse = await createVerificationTokenAction(existingUser.email);
        if (!tokenResponse.success || !tokenResponse.data) {
          throw new Error("Failed to create verification token");
        }
        await sendVerificationEmail(existingUser.email, tokenResponse.data.token);
        throw new Error("Account exists but email not verified. A new verification email has been sent.");
      }

      // Handle existing verified account
      throw new Error("An account with this email already exists. Please sign in instead.");
    }

    // Hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

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
      throw new Error("Failed to create user record");
    }

    const tokenResponse = await createVerificationTokenAction(newUser.email);
    if (!tokenResponse.success || !tokenResponse.data) {
      throw new Error("Failed to create verification token");
    }
    await sendVerificationEmail(newUser.email, tokenResponse.data.token);

    return {
      userId: newUser.id,
      message: "Account created successfully. Please check your email for verification.",
    };
  });
}

// ******************************************************
// ******************* signinQuery **********************
// ******************************************************
export async function signinQuery(input: unknown): Promise<ApiResponse<{ message: string }>> {
  return validateAndExecute(SigninSchema, input, async (parsedInput) => {
    try {
      await signIn("credentials", { ...parsedInput, redirect: false });
      return { message: "Successfully signed in" };
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.type) {
          case "CredentialsSignin":
          case "CallbackRouteError":
            throw new Error("Invalid credentials");
          case "AccessDenied":
            throw new Error("Please verify your email, sign up again to resend verification email");
          case "OAuthAccountAlreadyLinked" as AuthError["type"]:
            throw new Error("Login with your Google or Github account");
          default:
            throw new Error("Oops. Something went wrong");
        }
      }
      throw err; // Re-throw unexpected errors
    }
  });
}

// ******************************************************
// ************* findVerificationTokenByToken ***********
// ******************************************************
export async function findVerificationTokenByToken(
  token: unknown
): Promise<ApiResponse<typeof verificationTokens.$inferSelect | null>> {
  return validateAndExecute(
    z.object({ token: z.string().min(1, "Token is required") }),
    { token },
    async (parsedInput) => {
      const verificationToken = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, parsedInput.token))
        .then((res) => res[0] ?? null);

      return verificationToken;
    }
  );
}

// ******************************************************
// ******** deleteVerificationTokenByIdentifier *********
// ******************************************************
export async function deleteVerificationTokenByIdentifier(identifier: unknown): Promise<ApiResponse<void>> {
  return validateAndExecute(
    z.object({
      identifier: z.string().email("Invalid email format"),
    }),
    { identifier },
    async (parsedInput) => {
      await db
        .delete(verificationTokens)
        .where(eq(lower(verificationTokens.identifier), parsedInput.identifier.toLowerCase()));
    }
  );
}

// ******************************************************
// *********** verifyCredentialsEmailAction ************
// ******************************************************
export async function verifyCredentialsEmailAction(token: unknown): Promise<ApiResponse<{ success: boolean }>> {
  return validateAndExecute(
    z.object({ token: z.string().min(1, "Token is required") }),
    { token },
    async (parsedInput) => {
      // Get verification token
      const verificationTokenResponse = await findVerificationTokenByToken(parsedInput.token);
      if (!verificationTokenResponse.success || !verificationTokenResponse.data) {
        throw new Error("Invalid verification token");
      }

      const verificationToken = verificationTokenResponse.data;

      // Check if token is expired
      if (
        !verificationToken.expires ||
        new Date(verificationToken.expires) < new Date(Date.now() - 24 * 60 * 60 * 1000)
      ) {
        throw new Error("Verification token has expired");
      }

      // Find user
      const userResponse = await findUserByEmail(verificationToken.identifier);
      if (!userResponse.success || !userResponse.data) {
        throw new Error("User not found");
      }

      const existingUser = userResponse.data;

      // Verify email if conditions are met
      if (!existingUser.emailVerified && existingUser.email === verificationToken.identifier) {
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, existingUser.id));

        await db
          .update(verificationTokens)
          .set({ expires: new Date() })
          .where(eq(verificationTokens.identifier, existingUser.email));

        return { success: true };
      }

      throw new Error("Invalid verification attempt");
    }
  );
}

// ******************************************************
// **************** findUserByEmail ********************
// ******************************************************
export async function findUserByEmail(email: unknown): Promise<ApiResponse<typeof users.$inferSelect | null>> {
  return validateAndExecute(
    z.object({ email: z.string().email("Invalid email format") }),
    { email },
    async (parsedInput) => {
      const user = await db
        .select()
        .from(users)
        .where(eq(lower(users.email), parsedInput.email.toLowerCase()))
        .limit(1)
        .then((res) => res[0] ?? null);

      return user;
    }
  );
}

// ******************************************************
// ********** createVerificationTokenAction ************
// ******************************************************
export async function createVerificationTokenAction(identifier: unknown): Promise<ApiResponse<{ token: string }>> {
  return validateAndExecute(
    z.object({
      identifier: z.string().email("Invalid email format"),
    }),
    { identifier },
    async (parsedInput) => {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXP_MIN * 60 * 1000);

      await db.insert(verificationTokens).values({
        identifier: parsedInput.identifier.toLowerCase(),
        token,
        expires,
      });

      return { token };
    }
  );
}

// ******************************************************
// **************** forgotPasswordAction ****************
// ******************************************************

export async function forgotPasswordAction(
  input: unknown
): Promise<ApiResponse<{ success: boolean; data: { msg: string } }>> {
  return validateAndExecute(ForgotPasswordSchema, input, async (parsedInput) => {
    const email = parsedInput.email;

    try {
      const { data: existingUser } = await findUserByEmail(email);

      // this is a false positive, to deter malicious users
      if (!existingUser?.id) return { success: true, data: { msg: "Password reset email sent." } };

      if (!existingUser.hashedPassword) {
        return {
          success: false,
          data: { msg: "This user was created with OAuth, please sign in with OAuth" },
        };
      }

      const { data: verificationToken } = await createVerificationTokenAction(existingUser.email);

      if (verificationToken) {
        await sendForgotPasswordEmail(existingUser.email, verificationToken.token);
      }

      return { success: true, data: { msg: "Password reset email sent." } };
    } catch (err) {
      console.error(err);
      return { success: false, data: { msg: "Internal Server Error" } };
    }
  });
}
