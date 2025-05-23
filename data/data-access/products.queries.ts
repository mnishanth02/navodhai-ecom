import "server-only";
import db from "@/drizzle/db";
import { images, products } from "@/drizzle/schema";
import type {
  CategoryType,
  ColorType,
  ImageType,
  NewProductType,
  ProductType,
  SizeType,
} from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { desc, eq } from "drizzle-orm";

// ******************************************************
// *******************  getProductByIdQuery ****************
// ******************************************************

export async function getProductByIdQuery(
  productId: string,
): Promise<ApiResponse<ProductWithDetails>> {
  try {
    const productData = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    if (productData) {
      return {
        success: true,
        data: productData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product not found",
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
// ************* getAllProductsByStoreIdQuery ***********
// ******************************************************
export type ProductWithDetails = ProductType & {
  category: CategoryType;
  size: SizeType;
  color: ColorType;
  images: ImageType[];
};

interface ProductFilterProps {
  categoryId?: string;
  colorIds?: string[];
  sizeIds?: string[];
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
}

export async function getAllProductsByStoreIdQuery(
  storeId: string,
  searchParams?: ProductFilterProps,
): Promise<ApiResponse<ProductWithDetails[]>> {
  try {
    const query = db.query.products.findMany({
      where: (products, { and, eq, gte, lte, inArray }) => {
        const filters = [eq(products.storeId, storeId)];

        if (searchParams?.categoryId) {
          filters.push(eq(products.categoryId, searchParams.categoryId));
        }

        if (searchParams?.colorIds && searchParams.colorIds.length > 0) {
          filters.push(inArray(products.colorId, searchParams.colorIds));
        }

        if (searchParams?.sizeIds && searchParams.sizeIds.length > 0) {
          filters.push(inArray(products.sizeId, searchParams.sizeIds));
        }

        if (searchParams?.isFeatured !== undefined) {
          filters.push(eq(products.isFeatured, searchParams.isFeatured));
        }

        if (searchParams?.minPrice !== undefined) {
          filters.push(gte(products.price, searchParams.minPrice));
        }

        if (searchParams?.maxPrice !== undefined) {
          filters.push(lte(products.price, searchParams.maxPrice));
        }

        return and(...filters);
      },
      orderBy: [desc(products.createdAt)],
      with: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    });

    const productsData = await query;

    if (productsData) {
      return {
        success: true,
        data: productsData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No products found for this store",
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
// *******************  createProductQuery  ****************
// ******************************************************

export async function createProductQuery(
  data: NewProductType,
  imagesData: { url: string }[],
): Promise<ApiResponse<ProductType>> {
  try {
    const productData = await db
      .insert(products)
      .values(data)
      .returning()
      .then((res) => res[0] ?? null);

    if (imagesData.length > 0) {
      await db
        .insert(images)
        .values(
          imagesData.map((image) => ({
            productId: productData.id,
            url: image.url,
          })),
        )
        .returning()
        .then((res) => res[0] ?? null);
    }

    if (productData) {
      return {
        success: true,
        data: productData,
        message: "Product created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product creation failed",
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
// ***************** updateProductQuery  **************
// ******************************************************

export async function updateProductQuery(
  productId: string,
  data: NewProductType,
  imagesData?: { url: string }[],
): Promise<ApiResponse<ProductType>> {
  try {
    // First, delete all existing images
    await db.delete(images).where(eq(images.productId, productId));

    // Update the product details
    const updatedProduct = await db
      .update(products)
      .set({
        ...data,
      })
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0] ?? null);

    if (!updatedProduct) {
      return {
        success: false,
        error: {
          code: 404,
          message: "Product update failed",
        },
      };
    }

    // Insert new images
    if (imagesData && imagesData.length > 0) {
      await db.insert(images).values(
        imagesData.map((image) => ({
          productId: productId,
          url: image.url,
        })),
      );
    }

    // Fetch the updated product with its relations
    const productWithDetails = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    if (productWithDetails) {
      return {
        success: true,
        data: productWithDetails,
        message: "Product updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Failed to fetch updated product",
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
// *******************  deleteProductQuery  ***********
// ******************************************************

export async function deleteProductQuery(productId: string): Promise<ApiResponse<ProductType>> {
  try {
    const productData = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0] ?? null);

    if (productData) {
      return {
        success: true,
        data: productData,
        message: "Product deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product deletion failed",
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
