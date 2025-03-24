import Loader from "@/components/common/loader";
import { getAllProductsByStoreIdQuery } from "@/data/data-access/products.queries";
import { currencyFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { Suspense } from "react";
import ProductClient from "./components/client";
import type { ProductColumn } from "./components/columns";

interface BProductsPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductsPage = async ({ params }: BProductsPageProps) => {
  const { storeId } = await params;
  const productsData = await getAllProductsByStoreIdQuery(storeId);

  const formattedProducts: ProductColumn[] = productsData.success
    ? (productsData.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: currencyFormatter.format(Number(item.price)),
        category: item.category.name,
        size: item.size.value,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <ProductClient data={formattedProducts.length > 0 ? formattedProducts : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
