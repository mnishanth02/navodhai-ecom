import "server-only";
import db from "@/drizzle/db";
import { sizes } from "@/drizzle/schema";
import type { SizeType } from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { eq } from "drizzle-orm";

// ******************************************************
// *******************  getSizeByIdQuery ****************
// ******************************************************

export async function getSizeByIdQuery(sizeId: string): Promise<ApiResponse<SizeType>> {
  try {
    const sizeData = await db.query.sizes.findFirst({
      where: eq(sizes.id, sizeId),
    });

    if (sizeData) {
      return {
        success: true,
        data: sizeData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Size not found",
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
// ************* getAllSizesByStoreIdQuery ***********
// ******************************************************

export async function getAllSizesByStoreIdQuery(storeId: string): Promise<ApiResponse<SizeType[]>> {
  try {
    const sizeData = await db.query.sizes.findMany({
      where: eq(sizes.storeId, storeId),
    });

    if (sizeData) {
      return {
        success: true,
        data: sizeData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Sizes not found",
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
// *******************  createSizeQuery  ****************
// ******************************************************

export async function createSizeQuery(
  name: string,
  value: string,
  storeId: string,
): Promise<ApiResponse<SizeType>> {
  try {
    const sizeData = await db
      .insert(sizes)
      .values({
        name,
        value,
        storeId,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (sizeData) {
      return {
        success: true,
        data: sizeData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Size not found",
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
// ***************** updateSizeQuery  **************
// ******************************************************

export async function updateSizeQuery(
  id: string,
  data: Partial<SizeType>,
): Promise<ApiResponse<SizeType>> {
  try {
    const sizeData = await db
      .update(sizes)
      .set(data)
      .where(eq(sizes.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (sizeData) {
      return {
        success: true,
        data: sizeData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Size not found",
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
// *******************  deleteSizeQuery  ***********
// ******************************************************

export async function deleteSizeQuery(id: string): Promise<ApiResponse<SizeType>> {
  try {
    const sizeData = await db
      .delete(sizes)
      .where(eq(sizes.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (sizeData) {
      return {
        success: true,
        data: sizeData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Size not found",
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
