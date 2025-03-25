"use server";

import { ActionError } from "@/lib/error";
import { actionClient, storeActionClient } from "@/lib/utils/safe-action";
import { ProductSchema } from "@/lib/validator/store-validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createProductQuery,
  deleteProductQuery,
  getProductByIdQuery,
  updateProductQuery,
} from "../data-access/products.queries";

// Helper function to revalidate product-related paths
const revalidateProductPaths = (productId: string, categoryId?: string) => {
  // Revalidate product-specific pages
  revalidatePath(`/products/${productId}`);

  // Revalidate category pages if category is known
  if (categoryId) {
    revalidatePath(`/category/${categoryId}`);
  }

  // Revalidate checkout page for recommended products
  revalidatePath("/checkout");
};

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

    if (!result.success || !result.data) {
      throw new ActionError("Failed to create product");
    }

    // Revalidate paths after successful creation
    revalidateProductPaths(result.data.id, result.data.categoryId);

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

    if (!result.success || !result.data) {
      throw new ActionError("Failed to update product");
    }

    // Revalidate paths after successful update
    revalidateProductPaths(productId, result.data.categoryId);

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

    // Get product details before deletion for category ID
    const productCheck = await getProductByIdQuery(productId);
    const categoryId =
      productCheck.success && productCheck.data ? productCheck.data.categoryId : undefined;

    const result = await deleteProductQuery(productId);

    if (!result.success) {
      throw new ActionError("Make sure you removed all categories using this product");
    }

    // Revalidate paths after successful deletion
    revalidateProductPaths(productId, categoryId);

    return {
      product: result.data,
      message: "Product deleted successfully",
    };
  });
