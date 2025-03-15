import db from "@/drizzle/db";
import { stores } from "@/drizzle/schema";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

// ******************************************************
// *******************  createStoreQuery ****************
// ******************************************************
export async function createStoreQuery(
  name: string,
  userId: string,
): Promise<ApiResponse<typeof stores.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ name: z.string(), userId: z.string() });
    const validatedData = schema.parse({ name, userId });

    const store = await db
      .insert(stores)
      .values({ name: validatedData.name, userId: validatedData.userId })
      .returning()
      .then((res) => res[0] ?? null);

    if (store) {
      return {
        success: true,
        data: store,
        message: "Store created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store creation failed",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getStoreByIdQuery ****************
// ******************************************************
export async function getStoreByIdQuery(
  storeId: string,
  userId: string,
): Promise<ApiResponse<typeof stores.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ storeId: z.string(), userId: z.string() });
    const validatedData = schema.parse({ storeId, userId });

    const store = await db.query.stores.findFirst({
      where: and(
        eq(stores.id, validatedData.storeId),
        eq(stores.userId, validatedData.userId),
        isNull(stores.deletedAt),
      ),
    });

    if (store) {
      return {
        success: true,
        data: store,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store not found",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getStoreByUserIdQuery ****************
// ******************************************************
export async function getStoreByUserIdQuery(
  userId: string,
): Promise<ApiResponse<typeof stores.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ userId: z.string() });
    const validatedData = schema.parse({ userId });

    const store = await db.query.stores.findFirst({
      where: and(eq(stores.userId, validatedData.userId), isNull(stores.deletedAt)),
    });

    if (store) {
      return {
        success: true,
        data: store,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store not found",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getAllStoreByUserIdQuery ****************
// ******************************************************
export async function getAllStoreByUserIdQuery(
  userId: string,
): Promise<ApiResponse<(typeof stores.$inferSelect)[]>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ userId: z.string() });
    const validatedData = schema.parse({ userId });

    const allStores = await db.query.stores.findMany({
      where: and(eq(stores.userId, validatedData.userId), isNull(stores.deletedAt)),
    });

    if (allStores && allStores.length > 0) {
      return {
        success: true,
        data: allStores,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No stores found",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  updateStoreQuery ****************
// ******************************************************
export async function updateStoreQuery(
  storeId: string,
  name: string,
): Promise<ApiResponse<typeof stores.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ storeId: z.string(), name: z.string() });
    const validatedData = schema.parse({ storeId, name });

    const store = await db
      .update(stores)
      .set({ name: validatedData.name })
      .where(and(eq(stores.id, validatedData.storeId), isNull(stores.deletedAt)))
      .returning()
      .then((res) => res[0] ?? null);

    if (store) {
      return {
        success: true,
        data: store,
        message: "Store updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store not found",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  deleteStoreQuery ****************
// ******************************************************
export async function deleteStoreQuery(
  storeId: string,
): Promise<ApiResponse<typeof stores.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const schema = z.object({ storeId: z.string() });
    const validatedData = schema.parse({ storeId });

    const store = await db
      .update(stores)
      .set({ deletedAt: new Date() })
      .where(eq(stores.id, validatedData.storeId))
      .returning()
      .then((res) => res[0] ?? null);

    if (store) {
      return {
        success: true,
        data: store,
        message: "Store deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store not found",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
