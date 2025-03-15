import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { boolean, decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const stores = pgTable("store", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),
});

export const billboards = pgTable("billboard", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  label: text("label").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),
});

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  billboardId: text("billboardId")
    .notNull()
    .references(() => billboards.id),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // storesCategoriesIdx: index('stores_categories_idx').on(sql`${stores.id}`),
  // billboardsCategoriesIdx: index('billboards_categories_idx').on(sql`${billboards.id}`),
});

export const sizes = pgTable("size", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // storesSizesIdx: index('stores_sizes_idx').on(sql`${stores.id}`),
});

export const colors = pgTable("color", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // storesColorsIdx: index('stores_colors_idx').on(sql`${stores.id}`),
});

export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  price: decimal("price").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  sizeId: text("sizeId")
    .notNull()
    .references(() => sizes.id),
  colorId: text("colorId")
    .notNull()
    .references(() => colors.id),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // storesProductsIdx: index('stores_products_idx').on(sql`${stores.id}`),
  // categoriesProductsIdx: index('categories_products_idx').on(sql`${categories.id}`),
  // sizesProductsIdx: index('sizes_products_idx').on(sql`${sizes.id}`),
  // colorsProductsIdx: index('colors_products_idx').on(sql`${colors.id}`),
});

export const images = pgTable("image", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // productsImagesIdx: index('products_images_idx').on(sql`${products.id}`),
});

export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  isPaid: boolean("isPaid").default(false).notNull(),
  phone: text("phone").default("").notNull(),
  address: text("address").default("").notNull(),
  createdAt: timestamp("createdAt").default(sql`now()`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`now()`).notNull(),

  // storesOrdersIdx: index('stores_orders_idx').on(sql`${stores.id}`),
});

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id),
  productId: text("productId")
    .notNull()
    .references(() => products.id),

  // ordersOrderItemsIdx: index('orders_order_items_idx').on(sql`${orders.id}`),
  // productsOrderItemsIdx: index('products_order_items_idx').on(sql`${products.id}`),
});

export const storeRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
  categories: many(categories),
  sizes: many(sizes),
  colors: many(colors),
  products: many(products),
  orders: many(orders),
}));

export const billboardRelations = relations(billboards, ({ one, many }) => ({
  store: one(stores, {
    fields: [billboards.storeId],
    references: [stores.id],
  }),
  categories: many(categories),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboards, {
    fields: [categories.billboardId],
    references: [billboards.id],
  }),
  products: many(products),
}));

export const sizeRelations = relations(sizes, ({ one, many }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const colorRelations = relations(colors, ({ one, many }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
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

export const imageRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

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
