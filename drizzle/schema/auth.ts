import { userRoleEnum } from "./enums";
import { relations } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";

// ----------------------- USERS & AUTHENTICATION -----------------------
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    hashedPassword: text("hashed_password"),
    role: userRoleEnum("role").default("customer").notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    phoneVerified: timestamp("phone_verified", { mode: "date" }),
    lastLoginAt: timestamp("last_login_at", { mode: "date" }),
    lastActiveAt: timestamp("last_active_at", { mode: "date" }),
    metadata: jsonb("metadata"),
    preferences: jsonb("preferences").default("{}"),
    isActive: boolean("is_active").default(true).notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    banReason: text("ban_reason"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
    isMarketingOptIn: boolean("is_marketing_opt_in").default(false),
    marketingPreferences: jsonb("marketing_preferences").default("{}"),
  },
  (table) => [
    index("users_name_idx").on(table.name),
    index("users_email_idx").on(table.email),
    index("users_phone_idx").on(table.phoneNumber),
    index("users_role_idx").on(table.role),
    index("users_last_active_idx").on(table.lastActiveAt),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
    }),
  ]
);

// Audit log for user actions
export const userAuditLogs = pgTable(
  "user_audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 255 }).notNull(),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("user_audit_logs_user_id_idx").on(table.userId),
    index("user_audit_logs_action_idx").on(table.action),
    index("user_audit_logs_created_at_idx").on(table.createdAt),
  ]
);

/*******************************************
 ************** Relations *****************
 *******************************************
 */

// Relations for users
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

// Relations for accounts
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Relations for userAuditLogs
export const userAuditLogsRelations = relations(userAuditLogs, ({ one }) => ({
  user: one(users, {
    fields: [userAuditLogs.userId],
    references: [users.id],
  }),
}));

/*******************************************
 ************** Select SChema **************
 *******************************************
 */

export const usersSchema = createSelectSchema(users);
export const accountsSchema = createSelectSchema(accounts);
export const verificationTokensSchema = createSelectSchema(verificationTokens);
export const userAuditLogsSchema = createSelectSchema(userAuditLogs);

/************** Insert SChema ****************/

export const usersInsertSchema = createInsertSchema(users);
export const accountsInsertSchema = createInsertSchema(accounts);
export const verificationTokensInsertSchema = createInsertSchema(verificationTokens);
export const userAuditLogsInsertSchema = createInsertSchema(userAuditLogs);

/************** Update SChema ****************/

export const usersUpdateSchema = createUpdateSchema(users);
export const accountsUpdateSchema = createUpdateSchema(accounts);
export const verificationTokensUpdateSchema = createUpdateSchema(verificationTokens);
export const userAuditLogsUpdateSchema = createUpdateSchema(userAuditLogs);
