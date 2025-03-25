import type { ColorType, SizeType } from "@/drizzle/schema/store";
import { getBillboardByIdQuery } from "../data-access/billboard.queries";
import { type CategoryWithBillboard, getCategoryByIdQuery } from "../data-access/category.queries";
import { getAllColorsByStoreIdQuery } from "../data-access/color.queries";
import {
  type ProductWithDetails,
  getAllProductsByStoreIdQuery,
  getProductByIdQuery,
} from "../data-access/products.queries";
import { getAllSizesByStoreIdQuery } from "../data-access/size.queries";
import { env } from "../env/server-env";

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
}

export const getProducts = async (query: Query): Promise<ProductWithDetails[] | []> => {
  const result = await getAllProductsByStoreIdQuery(env.DEFAULT_STORE_ID, {
    ...query,
    colorIds: query.colorId ? query.colorId.split(",").filter(Boolean) : undefined,
    sizeIds: query.sizeId ? query.sizeId.split(",").filter(Boolean) : undefined,
  });

  if (result.success && result.data) {
    return result.data;
  }
  return [];
};

export const getProduct = async (productId: string): Promise<ProductWithDetails | null> => {
  const result = await getProductByIdQuery(productId);

  if (result.success && result.data) {
    return result.data;
  }

  return null;
};

export const getBillboard = async (billboardId: string) => {
  const result = await getBillboardByIdQuery(billboardId);

  if (result.success && result.data) {
    return result.data;
  }
  return null;
};

export const getSizes = async (): Promise<SizeType[] | null> => {
  const result = await getAllSizesByStoreIdQuery(env.DEFAULT_STORE_ID);

  if (result.success && result.data) {
    return result.data;
  }
  return [];
};

export const getColors = async (): Promise<ColorType[] | null> => {
  const result = await getAllColorsByStoreIdQuery(env.DEFAULT_STORE_ID);

  if (result.success && result.data) {
    return result.data;
  }
  return [];
};

export const getCategory = async (categoryId: string): Promise<CategoryWithBillboard | null> => {
  const result = await getCategoryByIdQuery(categoryId);

  if (result.success && result.data) {
    return result.data;
  }
  return null;
};
