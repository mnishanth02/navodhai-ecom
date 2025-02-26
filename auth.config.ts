import { env } from "./data/env/server-env";
import db from "./drizzle/db";
import * as schema from "./drizzle/schema";
import { usersInsertSchema } from "./drizzle/schema/auth";
import { userRoleSchema } from "./drizzle/schema/enums";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getTableColumns } from "drizzle-orm";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { z } from "zod";

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
        isBanned: false,
      };

      const dbUser = await db
        .insert(schema.users)
        .values(hasDefaultId ? newUser : { id, ...newUser })
        .returning()
        .then((res) => res[0]);

      return dbUser;
    },
  },
} satisfies NextAuthConfig;
