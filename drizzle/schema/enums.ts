import { pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

// Enums for Order Status and other fixed value fields
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);
export const productStatusEnum = pgEnum("product_status", ["draft", "published", "archived"]);
export const userRoleEnum = pgEnum("user_role", ["customer", "admin", "staff"]);
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed_amount"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const shippingStatusEnum = pgEnum("shipping_status", ["pending", "processing", "shipped", "delivered"]);
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const refundStatusEnum = pgEnum("refund_status", ["pending", "processing", "completed", "failed", "cancelled"]);

//  Select Schemas
export const userRoleSchema = createSelectSchema(userRoleEnum);
