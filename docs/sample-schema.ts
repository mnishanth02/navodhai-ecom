import { relations } from "drizzle-orm";
import { boolean, decimal, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Store Table
export const stores = pgTable("Store", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Billboard Table
export const billboards = pgTable(
  "Billboard",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    imageUrl: text("imageUrl").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
    };
  },
);

export const billboardsRelations = relations(billboards, ({ one, many }) => ({
  store: one(stores, {
    fields: [billboards.storeId],
    references: [stores.id],
  }),
  categories: many(categories),
}));

// Category Table
export const categories = pgTable(
  "Category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    billboardId: uuid("billboardId")
      .notNull()
      .references(() => billboards.id),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
      billboardIdIdx: index("billboardId_idx").on(table.billboardId),
    };
  },
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
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

// Size Table
export const sizes = pgTable(
  "Size",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
    };
  },
);

export const sizesRelations = relations(sizes, ({ one, many }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

// Color Table
export const colors = pgTable(
  "Color",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
    };
  },
);

export const colorsRelations = relations(colors, ({ one, many }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

// Product Table
export const products = pgTable(
  "Product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    categoryId: uuid("categoryId")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    price: decimal("price").notNull(),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    isArchived: boolean("isArchived").default(false).notNull(),
    sizeId: uuid("sizeId")
      .notNull()
      .references(() => sizes.id),
    colorId: uuid("colorId")
      .notNull()
      .references(() => colors.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
      categoryIdIdx: index("categoryId_idx").on(table.categoryId),
      sizeIdIdx: index("sizeId_idx").on(table.sizeId),
      colorIdIdx: index("colorId_idx").on(table.colorId),
    };
  },
);

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

// Image Table
export const images = pgTable(
  "Image",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      productIdIdx: index("productId_idx").on(table.productId),
    };
  },
);
export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

// Order Table
export const orders = pgTable(
  "Order",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("storeId")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    isPaid: boolean("isPaid").default(false).notNull(),
    phone: text("phone").default("").notNull(),
    address: text("address").default("").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("storeId_idx").on(table.storeId),
    };
  },
);
export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

// OrderItems Table
export const orderItems = pgTable(
  "OrderItems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("orderId")
      .notNull()
      .references(() => orders.id),
    productId: uuid("productId")
      .notNull()
      .references(() => products.id),
  },
  (table) => {
    return {
      orderIdIdx: index("orderId_idx").on(table.orderId),
      productIdIdx: index("productId_idx").on(table.productId),
    };
  },
);

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

export const storesRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
  categories: many(categories),
  sizes: many(sizes),
  colors: many(colors),
  products: many(products),
  orders: many(orders),
}));
