import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [...authConfigProviders],
});

export const { signIn, signOut, auth, handlers } = nextAuth;
