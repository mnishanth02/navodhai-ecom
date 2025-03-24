import { relations } from "drizzle-orm";
import { boolean, decimal, index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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

// Product Table
export const products = pgTable(
  "product",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    sizeId: text("size_id")
      .notNull()
      .references(() => sizes.id),
    colorId: text("color_id")
      .notNull()
      .references(() => colors.id),
    name: text("name").notNull(),
    price: decimal("price").notNull(),
    description: text("description"),
    primaryImageUrl: text("primary_image_url"),
    isArchived: boolean("is_archived").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("product_storeId_idx").on(table.storeId),
    index("product_categoryId_idx").on(table.categoryId),
    index("product_sizeId_idx").on(table.sizeId),
    index("product_colorId_idx").on(table.colorId),
  ],
);

// Image Table
export const images = pgTable(
  "image",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("image_productId_idx").on(table.productId)],
);

// Order Table
export const orders = pgTable(
  "order",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    phone: text("phone").default("").notNull(),
    isPaid: boolean("is_paid").default(false).notNull(),
    address: text("address").default("").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("order_storeId_idx").on(table.storeId)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("orderId_idx").on(table.orderId),
    index("orderItem_productId_idx").on(table.productId),
  ],
);
// ----------------------- RELATIONS -----------------------

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  size: one(sizes, {
    fields: [products.sizeId],
    references: [sizes.id],
  }),
  color: one(colors, {
    fields: [products.colorId],
    references: [colors.id],
  }),
  images: many(images),
  orderItems: many(orderItems),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboard, {
    fields: [categories.billboardId],
    references: [billboard.id],
  }),
  products: many(products),
}));

export const sizesRelations = relations(sizes, ({ one, many }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const colorsRelations = relations(colors, ({ one, many }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  products: many(products),
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
  products: many(products),
  orders: many(orders),
}));

//  selectQueries
export const storesSelectSchema = createSelectSchema(stores);
export const billboardSelectSchema = createSelectSchema(billboard);
export const categoriesSelectSchema = createSelectSchema(categories);
export const sizesSelectSchema = createSelectSchema(sizes);
export const colorsSelectSchema = createSelectSchema(colors);
export const imagesSelectSchema = createSelectSchema(images);
export const productsSelectSchema = createSelectSchema(products);
export const ordersSelectSchema = createSelectSchema(orders);
export const orderItemsSelectSchema = createSelectSchema(orderItems);

//   Select Types
export type StoreType = typeof stores.$inferSelect;
export type BillboardType = typeof billboard.$inferSelect;
export type CategoryType = typeof categories.$inferSelect;
export type SizeType = typeof sizes.$inferSelect;
export type ColorType = typeof colors.$inferSelect;
export type ImageType = typeof images.$inferSelect;
export type ProductType = typeof products.$inferSelect;
export type OrderType = typeof orders.$inferSelect;
export type OrderItemType = typeof orderItems.$inferSelect;

//  Insert Types
export type NewProductType = typeof products.$inferInsert;
