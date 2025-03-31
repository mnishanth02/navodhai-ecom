"use server";

import { ActionError } from "@/lib/error";
import { storeActionClient } from "@/lib/utils/safe-action";
import { CategorySchema } from "@/lib/validator/store-validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCategoryQuery,
  deleteCategoryQuery,
  getCategoryByIdQuery,
  updateCategoryQuery,
} from "../data-access/category.queries";

// Helper function to revalidate product-related paths
const revalidateCategoryPaths = (categoryId: string) => {
  // Revalidate category-specific pages
  revalidatePath(`/category/${categoryId}`);
};
// Create category action
export const createCategory = storeActionClient
  .metadata({
    actionName: "createCategory",
    requiresAuth: true,
  })
  .schema(
    CategorySchema.extend({
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { name, billboardId } = parsedInput;
    const { store } = ctx;

    const result = await createCategoryQuery(name, billboardId, store.id);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create category");
    }

    revalidateCategoryPaths(result.success && result.data ? result.data.id : "");

    return {
      billboard: result.data,
      message: "Category created successfully",
    };
  });

// Update billboard action
export const updateCategory = storeActionClient
  .metadata({
    actionName: "updateCategory",
    requiresAuth: true,
  })
  .schema(
    CategorySchema.extend({
      storeId: z.string().min(1),
      categoryId: z.string().min(1, "Category ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { billboardId, name, categoryId } = parsedInput;

    // Verify billboard exists in this store
    const categoryCheck = await getCategoryByIdQuery(categoryId);
    if (!categoryCheck.success) {
      throw new ActionError("Category not found in this store");
    }

    const result = await updateCategoryQuery(categoryId, {
      name,
      billboardId,
    });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update category");
    }

    revalidateCategoryPaths(result.success && result.data ? result.data.id : "");

    return {
      billboard: result.data,
      message: "Category updated successfully",
    };
  });

// Delete billboard action
export const deleteCategory = storeActionClient
  .metadata({
    actionName: "deleteCategory",
    requiresAuth: true,
  })
  .schema(
    z.object({
      storeId: z.string().min(1),
      categoryId: z.string().min(1, "Category ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { categoryId } = parsedInput;

    console.log("Deleting category with ID:", categoryId);

    const result = await deleteCategoryQuery(categoryId);

    if (!result.success) {
      throw new ActionError(
        result.error?.message || "Make sure you removed all products using this cateogory",
      );
    }

    revalidateCategoryPaths(result.success && result.data ? result.data.id : "");

    return {
      billboard: result.data,
      message: "Category deleted successfully",
    };
  });
