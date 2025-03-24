import Loader from "@/components/common/loader";
import { getAllCategoryByStoreIdQuery } from "@/data/data-access/category.queries";
import { getAllColorsByStoreIdQuery } from "@/data/data-access/color.queries";
import { getProductByIdQuery } from "@/data/data-access/products.queries";
import { getAllSizesByStoreIdQuery } from "@/data/data-access/size.queries";
import { Suspense } from "react";
import ProductForm from "./components/product-form";

interface ProductPageProps {
  params: Promise<{ productId: string; storeId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  const productData = await getProductByIdQuery(productId);
  const categories = await getAllCategoryByStoreIdQuery(storeId);
  const sizes = await getAllSizesByStoreIdQuery(storeId);
  const colors = await getAllColorsByStoreIdQuery(storeId);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={productData?.success && productData.data ? productData.data : null}
          categories={categories?.success && categories.data ? categories.data : []}
          sizes={sizes?.success && sizes.data ? sizes.data : []}
          colors={colors?.success && colors.data ? colors.data : []}
        />
      </div>
    </Suspense>
  );
};

export default ProductPage;
