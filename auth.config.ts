import { env } from "./data/env/server-env";
import db from "./drizzle/db";
import * as schema from "./drizzle/schema";
import { usersInsertSchema } from "./drizzle/schema/auth";
import { userRoleSchema } from "./drizzle/schema/enums";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, getTableColumns } from "drizzle-orm";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { DEFAULT_SIGNIN_REDIRECT } from "./lib/routes";
import { oauthVerifyEmailAction } from "./lib/data-access/auth-queries";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in" },

  adapter: {
    ...DrizzleAdapter(db, {
      accountsTable: schema.accounts,
      usersTable: schema.users,
      verificationTokensTable: schema.verificationTokens,
    }),
    createUser: async (user) => {
      const { id, ...insertData } = user;
      const hasDefaultId = getTableColumns(schema.users)["id"]["hasDefault"];

      // TODO need to check when ot udpate admin / customer
      const newUser: z.infer<typeof usersInsertSchema> = {
        ...insertData,
        role: userRoleSchema.enum.customer,
        isActive: true,
      };

      const dbUser = await db
        .insert(schema.users)
        .values(hasDefaultId ? newUser : { id, ...newUser })
        .returning()
        .then((res) => res[0]);

      return dbUser;
    },
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;

      // Protected routes that require authentication
      const protectedPaths = [
        "/profile",
        "/orders",
        "/cart",
        "/checkout",
        "/wishlist",
        "/settings",
      ];

      const isProtectedPath = protectedPaths.some(path =>
        nextUrl.pathname.startsWith(path)
      );

      // Admin/staff only routes
      const adminPaths = ["/admin", "/dashboard"];
      const isAdminPath = adminPaths.some(path =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtectedPath || isAdminPath) {
        if (!isLoggedIn) {
          return false; // Redirect to sign in
        }

        // For admin paths, check role
        if (isAdminPath) {
          const userRole = auth?.user?.role;
          return userRole === "admin" || userRole === "staff";
        }

        return true;
      }

      // Auth pages redirect logged in users
      const isAuthPath = nextUrl.pathname.startsWith("/auth");
      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
      }

      return true;
    },

    async signIn({ user, account, profile }) {

      // For OAuth sign-in, update user data if needed
      if (account?.provider === "google" && profile && user.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(schema.users.id, user.id)
        });

        if (dbUser) {
          await db.update(schema.users)
            .set({
              name: profile.name || dbUser.name,
              image: profile.picture || dbUser.image,
              emailVerified: profile.email_verified ? new Date() : dbUser.emailVerified
            })
            .where(eq(schema.users.id, dbUser.id));
        }
      }

      // Verify email for OAuth providers
      if (account?.provider === "google" && profile?.email_verified) {
        return true;
      }

      if (account?.provider === "credentials") {
        return !!user.emailVerified;
      }

      return false;
    },

    async jwt({ token, user, trigger, session }) {
      if (!token.maxAge) {
        token.maxAge = 30 * 24 * 60 * 60;
      }

      if (user?.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(schema.users.id, user.id),
          columns: {
            id: true,
            role: true,
            isActive: true,
            name: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive ?? false;
        }
      }

      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "customer" | "admin" | "staff";
        session.user.isActive = token.isActive as boolean;
      }

      return session;
    },
  },

  events: {
    async linkAccount({ user, account }) {
      if (["google"].includes(account.provider) && user.email) {
        await oauthVerifyEmailAction(user.email);
      }
    },

    async signIn({ user }) {
      if (user.id) {
        // Update last login timestamp
        await db
          .update(schema.users)
          .set({ lastLoginAt: new Date() })
          .where(eq(schema.users.id, user.id));
      }
    },
  },
} satisfies NextAuthConfig;
