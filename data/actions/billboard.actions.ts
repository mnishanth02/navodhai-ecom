"use server";

import { ActionError } from "@/lib/error";
import { actionClient, storeActionClient } from "@/lib/utils/safe-action";
import { BillboardSchema } from "@/lib/validator/store-validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createBillboardQuery,
  deleteBillboardQuery,
  getBillboardByIdQuery,
  updateBillboardHomeStatusQuery,
  updateBillboardQuery,
} from "../data-access/billboard.queries";

// Create billboard action
export const createBillboard = storeActionClient
  .metadata({
    actionName: "createBillboard",
    requiresAuth: true,
  })
  .schema(
    BillboardSchema.extend({
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { label, imageUrls, primaryImageUrl } = parsedInput;
    const { store } = ctx;

    const result = await createBillboardQuery(label, primaryImageUrl, store.id, imageUrls);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create billboard");
    }

    return {
      billboard: result.data,
      message: "Billboard created successfully",
    };
  });

// Update billboard action
export const updateBillboard = storeActionClient
  .metadata({
    actionName: "updateBillboard",
    requiresAuth: true,
  })
  .schema(
    BillboardSchema.extend({
      billboardId: z.string().min(1, "Billboard ID is required"),
      storeId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { billboardId, label, imageUrls, primaryImageUrl } = parsedInput;

    // Verify billboard exists in this store
    const billboardCheck = await getBillboardByIdQuery(billboardId);

    if (!billboardCheck.success) {
      throw new ActionError("Billboard not found in this store");
    }

    const result = await updateBillboardQuery(billboardId, label, primaryImageUrl, imageUrls);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update billboard");
    }

    return {
      billboard: result.data,
      message: "Billboard updated successfully",
    };
  });

// Delete billboard action
export const deleteBillboard = actionClient
  .metadata({
    actionName: "deleteBillboard",
    requiresAuth: true,
  })
  .schema(
    z.object({
      billboardId: z.string().min(1, "Billboard ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { billboardId } = parsedInput;

    const result = await deleteBillboardQuery(billboardId);

    if (!result.success) {
      throw new ActionError("Make sure you removed all categories using this billboard");
    }

    return {
      billboard: result.data,
      message: "Billboard deleted successfully",
    };
  });

// Update billboard home status action
export const updateBillboardHomeStatusAction = storeActionClient
  .metadata({
    actionName: "updateBillboardHomeStatusAction",
    requiresAuth: true,
  })
  .schema(
    z.object({
      billboardId: z.string().min(1, "Billboard ID is required"),
      storeId: z.string().min(1),
      isHome: z.boolean(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { billboardId, isHome } = parsedInput;

    // Verify billboard exists in this store
    const billboardCheck = await getBillboardByIdQuery(billboardId);

    if (!billboardCheck.success) {
      throw new ActionError("Billboard not found in this store");
    }

    const result = await updateBillboardHomeStatusQuery(billboardId, isHome);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update billboard home status");
    }

    revalidatePath("/");

    return {
      billboard: result.data,
      message: "Billboard home status updated successfully",
    };
  });
