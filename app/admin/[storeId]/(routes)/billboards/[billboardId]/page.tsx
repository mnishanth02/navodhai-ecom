import Loader from "@/components/common/loader";
import { getBillboardByIdQuery } from "@/data/data-access/billboard.queries";
import { Suspense } from "react";
import BillboardForm from "./components/billboard-form";

interface BillboardPageProps {
  params: Promise<{ billboardId: string }>;
}

const BillboardPage = async ({ params }: BillboardPageProps) => {
  const { billboardId } = await params;

  const billboard = await getBillboardByIdQuery(billboardId);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard?.success ? billboard.data : null} />
      </div>
    </Suspense>
  );
};

export default BillboardPage;
