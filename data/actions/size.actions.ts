"use server";

import { ActionError } from "@/lib/error";
import { storeActionClient } from "@/lib/utils/safe-action";
import { SizeSchema } from "@/lib/validator/store-validator";
import { z } from "zod";
import {
  createSizeQuery,
  deleteSizeQuery,
  getSizeByIdQuery,
  updateSizeQuery,
} from "../data-access/size.queries";

// Create category action
export const createSize = storeActionClient
  .metadata({
    actionName: "createSize",
    requiresAuth: true,
  })
  .schema(
    SizeSchema.extend({
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { name, value } = parsedInput;
    const { store } = ctx;

    const result = await createSizeQuery(name, value, store.id);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create size");
    }

    return {
      billboard: result.data,
      message: "Size created successfully",
    };
  });

// Update billboard action
export const updateSize = storeActionClient
  .metadata({
    actionName: "updateSize",
    requiresAuth: true,
  })
  .schema(
    SizeSchema.extend({
      storeId: z.string().min(1),
      sizeId: z.string().min(1, "Size ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { name, value, sizeId } = parsedInput;

    // Verify billboard exists in this store
    const sizeCheck = await getSizeByIdQuery(sizeId);
    if (!sizeCheck.success) {
      throw new ActionError("Size not found in this store");
    }

    const result = await updateSizeQuery(sizeId, {
      name,
      value,
    });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update size");
    }

    return {
      billboard: result.data,
      message: "Size updated successfully",
    };
  });

// Delete billboard action
export const deleteSize = storeActionClient
  .metadata({
    actionName: "deleteSize",
    requiresAuth: true,
  })
  .schema(
    z.object({
      storeId: z.string().min(1),
      sizeId: z.string().min(1, "Size ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { sizeId } = parsedInput;

    const result = await deleteSizeQuery(sizeId);

    if (!result.success) {
      throw new ActionError(
        result.error?.message || "Make sure you removed all products using this size",
      );
    }

    return {
      billboard: result.data,
      message: "Size deleted successfully",
    };
  });
