import Loader from "@/components/common/loader";
import { getAllCategoryByStoreIdQuery } from "@/data/data-access/category.queries";
import { format } from "date-fns";
import { Suspense } from "react";
import CategoryClient from "./components/client";
import type { CategoryColumn } from "./components/columns";

interface CategoryPageProps {
  params: Promise<{ storeId: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { storeId } = await params;
  const categories = await getAllCategoryByStoreIdQuery(storeId);

  const formattedCategories: CategoryColumn[] = categories.success
    ? (categories.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard?.label || "",
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <CategoryClient data={formattedCategories.length > 0 ? formattedCategories : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryPage;
