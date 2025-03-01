import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";


// ----------------------- STORES -----------------------
export const stores = pgTable("store", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("user_id").references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const storeRelations = relations(stores, ({ one }) => ({
    user: one(users, {
        fields: [stores.userId],
        references: [users.id],
    }),
}));