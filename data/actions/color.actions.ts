"use server";

import { ActionError } from "@/lib/error";
import { storeActionClient } from "@/lib/utils/safe-action";
import { ColorSchema } from "@/lib/validator/store-validator";
import { z } from "zod";
import {
  createColorQuery,
  deleteColorQuery,
  getColorByIdQuery,
  updateColorQuery,
} from "../data-access/color.queries";

// Create category action
export const createColor = storeActionClient
  .metadata({
    actionName: "createColor",
    requiresAuth: true,
  })
  .schema(
    ColorSchema.extend({
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { name, value } = parsedInput;
    const { store } = ctx;

    const result = await createColorQuery(name, value, store.id);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create color");
    }

    return {
      billboard: result.data,
      message: "Color created successfully",
    };
  });

// Update billboard action
export const updateColor = storeActionClient
  .metadata({
    actionName: "updateColor",
    requiresAuth: true,
  })
  .schema(
    ColorSchema.extend({
      storeId: z.string().min(1),
      colorId: z.string().min(1, "Color ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { name, value, colorId } = parsedInput;

    // Verify billboard exists in this store
    const colorCheck = await getColorByIdQuery(colorId);
    if (!colorCheck.success) {
      throw new ActionError("Color not found in this store");
    }

    const result = await updateColorQuery(colorId, {
      name,
      value,
    });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update color");
    }

    return {
      billboard: result.data,
      message: "Color updated successfully",
    };
  });

// Delete billboard action
export const deleteColor = storeActionClient
  .metadata({
    actionName: "deleteColor",
    requiresAuth: true,
  })
  .schema(
    z.object({
      storeId: z.string().min(1),
      colorId: z.string().min(1, "Color ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { colorId } = parsedInput;

    const result = await deleteColorQuery(colorId);

    if (!result.success) {
      throw new ActionError(
        result.error?.message || "Make sure you removed all products using this Color",
      );
    }

    return {
      billboard: result.data,
      message: "Color deleted successfully",
    };
  });
