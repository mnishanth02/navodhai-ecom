"use server";

import { ActionError } from "@/lib/error";
import { actionClient, storeActionClient } from "@/lib/utils/safe-action";
import { ProductSchema } from "@/lib/validator/store-validator";
import { z } from "zod";
import {
  createProductQuery,
  deleteProductQuery,
  getProductByIdQuery,
  updateProductQuery,
} from "../data-access/products.queries";

// Create product action
export const createProduct = storeActionClient
  .metadata({
    actionName: "createProduct",
    requiresAuth: true,
  })
  .schema(
    ProductSchema.extend({
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { images } = parsedInput;
    // const { store } = ctx;

    const result = await createProductQuery(
      {
        ...parsedInput,
        price: parsedInput.price.toFixed(2),
      },
      images,
    );

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create product");
    }

    return {
      product: result.data,
      message: "Product created successfully",
    };
  });

// Update product action
export const updateProduct = storeActionClient
  .metadata({
    actionName: "updateProduct",
    requiresAuth: true,
  })
  .schema(
    ProductSchema.extend({
      productId: z.string().min(1, "Product ID is required"),
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { productId } = parsedInput;

    // Verify product exists in this store
    const productCheck = await getProductByIdQuery(productId);

    if (!productCheck.success) {
      throw new ActionError("Product not found in this store");
    }

    const result = await updateProductQuery(productId, {
      ...parsedInput,
      price: parsedInput.price.toFixed(2),
    });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update product");
    }

    return {
      product: result.data,
      message: "Product updated successfully",
    };
  });

// Delete product action
export const deleteProduct = actionClient
  .metadata({
    actionName: "deleteProduct",
    requiresAuth: true,
  })
  .schema(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { productId } = parsedInput;

    const result = await deleteProductQuery(productId);

    if (!result.success) {
      throw new ActionError(
        result.error?.message || "Make sure you removed all categories using this product",
      );
    }

    return {
      product: result.data,
      message: "Product deleted successfully",
    };
  });
