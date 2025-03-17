import "server-only";
import db from "@/drizzle/db";
import { colors } from "@/drizzle/schema";
import type { ColorType } from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { eq } from "drizzle-orm";

// ******************************************************
// *******************  getColorByIdQuery ****************
// ******************************************************

export async function getColorByIdQuery(colorId: string): Promise<ApiResponse<ColorType>> {
  try {
    const colorData = await db.query.colors.findFirst({
      where: eq(colors.id, colorId),
    });

    if (colorData) {
      return {
        success: true,
        data: colorData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Color not found",
      },
    };
  } catch (error) {
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
// ************* getAllColorsByStoreIdQuery ***********
// ******************************************************

export async function getAllColorsByStoreIdQuery(
  storeId: string,
): Promise<ApiResponse<ColorType[]>> {
  try {
    const colorData = await db.query.colors.findMany({
      where: eq(colors.storeId, storeId),
    });

    if (colorData) {
      return {
        success: true,
        data: colorData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Colors not found",
      },
    };
  } catch (error) {
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
// *******************  createColorQuery  ****************
// ******************************************************

export async function createColorQuery(
  name: string,
  value: string,
  storeId: string,
): Promise<ApiResponse<ColorType>> {
  try {
    const colorData = await db
      .insert(colors)
      .values({
        name,
        value,
        storeId,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (colorData) {
      return {
        success: true,
        data: colorData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Color not found",
      },
    };
  } catch (error) {
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
// ***************** updateColorQuery  **************
// ******************************************************

export async function updateColorQuery(
  id: string,
  data: Partial<ColorType>,
): Promise<ApiResponse<ColorType>> {
  try {
    const colorData = await db
      .update(colors)
      .set(data)
      .where(eq(colors.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (colorData) {
      return {
        success: true,
        data: colorData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Color not found",
      },
    };
  } catch (error) {
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
// *******************  deleteColorQuery  ***********
// ******************************************************

export async function deleteColorQuery(id: string): Promise<ApiResponse<ColorType>> {
  try {
    const colorData = await db
      .delete(colors)
      .where(eq(colors.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (colorData) {
      return {
        success: true,
        data: colorData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Color not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
