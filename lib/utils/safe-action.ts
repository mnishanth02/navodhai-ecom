import { auth } from "@/auth";
import { env } from "@/data/env/server-env";
import { validateSpecificStore } from "@/data/helper/store-helper";
import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { ActionError } from "../error";

// Base action client without authentication
export const actionClient = createSafeActionClient({
  handleServerError(error: unknown) {
    // Log the error for debugging
    console.error("Server action error:", error);

    // Return custom error messages for known error types
    if (error instanceof ActionError) {
      return error.message;
    }

    if (error instanceof Error) {
      // Only return actual error messages in development
      if (env.NODE_ENV === "development") {
        return error.message;
      }
    }

    // Return a generic message in production
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  // Define metadata schema for actions
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().optional(),
      requiresAuth: z.boolean().optional().default(false),
    });
  },
});

// Action client with authentication
export const authActionClient = actionClient
  // Define authentication middleware
  .use(async ({ next }) => {
    const session = await auth();

    if (!session || !session.user) {
      throw new ActionError("Unauthorized: You must be logged in to perform this action");
    }

    // Pass the user to the next middleware/action
    return next({
      ctx: {
        user: session.user,
        userId: session.user.id as string,
      },
    });
  });

// Action client with authentication and store validation
export const storeActionClient = authActionClient.use(async ({ ctx, next, clientInput }) => {
  // Type-safe check for storeId in input
  const inputObj = clientInput as { storeId?: string };
  const storeId = inputObj.storeId;

  if (!storeId) {
    throw new ActionError("Store ID is required for this action");
  }

  // Validate store access
  const store = await validateSpecificStore(storeId);

  if (!store?.id) {
    throw new ActionError("Store not found");
  }

  // Pass the validated store to the next middleware/action
  return next({
    ctx: {
      ...ctx,
      store,
      storeId,
    },
  });
});
