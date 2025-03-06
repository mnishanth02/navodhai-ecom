import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
  ],
});

export const { signIn, signOut, auth, handlers } = nextAuth;
