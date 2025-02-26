import authConfig from "./auth.config";
import { findUserByEmail } from "./lib/data-access/auth-queries";
import { OAuthAccountAlreadyLinkedError } from "./lib/error";
import { SigninSchema } from "./lib/validator/auth-validtor";
import argon2 from "argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = SigninSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await findUserByEmail(email);

          if (!user.success || !user.data) return null;

          if (!user.data.hashedPassword) throw new OAuthAccountAlreadyLinkedError();

          const passwordsMatch = await argon2.verify(user.data.hashedPassword, password);

          if (passwordsMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { hashedPassword, ...userWithoutPassword } = user.data;
            return userWithoutPassword;
          }
        }
        return null;
      },
    }),
  ],
});

export const { signIn, signOut, auth, handlers } = nextAuth;
