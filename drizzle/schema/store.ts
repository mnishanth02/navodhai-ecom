import { relations } from "drizzle-orm";
import { index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
    imageUrls: json("image_urls").$type<string[]>(),
    primaryImageUrl: text("primary_image_url"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("store_id_idx").on(table.storeId)],
);

// Category Table
export const categories = pgTable(
  "category",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    billboardId: text("billboard_id")
      .notNull()
      .references(() => billboard.id),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("storeId_idx").on(table.storeId),
    index("billboardId_idx").on(table.billboardId),
  ],
);

// Size Table
export const sizes = pgTable(
  "size",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("size_storeId_idx").on(table.storeId), index("size_name_idx").on(table.name)],
);
// Color Table
export const colors = pgTable(
  "color",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("color_storeId_idx").on(table.storeId), index("color_name_idx").on(table.name)],
);

// ----------------------- RELATIONS -----------------------

export const categoriesRelations = relations(categories, ({ one }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboard, {
    fields: [categories.billboardId],
    references: [billboard.id],
  }),
  // products: many(products),
}));

export const sizesRelations = relations(sizes, ({ one }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  // products: many(products),
}));

export const colorsRelations = relations(colors, ({ one }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  // products: many(products),
}));

export const storeRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  billboards: many(billboard),
  categories: many(categories),
  sizes: many(sizes),
  colors: many(colors),
  // products: many(products),
  // orders: many(orders),
}));

//  selectQueries
export const storesSelectSchema = createSelectSchema(stores);
export const billboardSelectSchema = createSelectSchema(billboard);
export const categoriesSelectSchema = createSelectSchema(categories);
export const sizesSelectSchema = createSelectSchema(sizes);
export const colorsSelectSchema = createSelectSchema(colors);

//   Types
export type StoreType = typeof stores.$inferSelect;
export type BillboardType = typeof billboard.$inferSelect;
export type CategoryType = typeof categories.$inferSelect;
export type SizeType = typeof sizes.$inferSelect;
export type ColorType = typeof colors.$inferSelect;
