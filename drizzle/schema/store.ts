import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { createSelectSchema } from "drizzle-zod";
import { users } from "./auth";

// ----------------------- STORES -----------------------
export const stores = pgTable(
  "store",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("user_id").references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("store_name_idx").on(table.name)],
);

// Billboards
export const billboard = pgTable(
  "billboard",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("store_id_idx").on(table.storeId)],
);

// ----------------------- RELATIONS -----------------------

//  convert below prisma relations to drizzle relations

//

export const storeRelations = relations(stores, ({ one }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
}));

//  selectQueries
export const storesSelectSchema = createSelectSchema(stores);
export const billboardSelectSchema = createSelectSchema(billboard);

//  insertQueries
export const storesInsertSchema = createInsertSchema(stores);
export const billboardInsertSchema = createInsertSchema(billboard);

//  updateQueries
export const storesUpdateSchema = createUpdateSchema(stores);
export const billboardUpdateSchema = createUpdateSchema(billboard);

//  Store Types
export type StoreType = typeof stores.$inferSelect;
export type NewStoreType = typeof storesInsertSchema;
export type UpdateStoreType = typeof storesUpdateSchema;

//  Billboards Types
export type BillboardType = typeof billboard.$inferSelect;
export type NewBillboardType = typeof billboardInsertSchema;
export type UpdateBillboardType = typeof billboardUpdateSchema;
