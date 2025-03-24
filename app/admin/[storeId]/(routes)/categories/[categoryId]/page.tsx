import Loader from "@/components/common/loader";
import { getAllBillBoardByStoreIdQuery } from "@/data/data-access/billboard.queries";
import { getCategoryByIdQuery } from "@/data/data-access/category.queries";
import { Suspense } from "react";
import CategoryForm from "./components/category-form";

interface BillboardPageProps {
  params: Promise<{ categoryId: string; storeId: string }>;
}

const BillboardPage = async ({ params }: BillboardPageProps) => {
  const { categoryId, storeId } = await params;

  const category = await getCategoryByIdQuery(categoryId);

  const bilboards = await getAllBillBoardByStoreIdQuery(storeId);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          billBoards={bilboards?.success && bilboards.data ? bilboards.data : []}
          initialData={category?.success && category.data ? category.data : null}
        />
      </div>
    </Suspense>
  );
};

export default BillboardPage;
