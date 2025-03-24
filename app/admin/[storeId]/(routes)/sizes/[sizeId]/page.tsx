import Loader from "@/components/common/loader";
import { getSizeByIdQuery } from "@/data/data-access/size.queries";
import { Suspense } from "react";
import SizeForm from "./components/size-form";

interface SizeDetailsPageProps {
  params: Promise<{ sizeId: string }>;
}

const SizeDetailsPage = async ({ params }: SizeDetailsPageProps) => {
  const { sizeId } = await params;

  const size = await getSizeByIdQuery(sizeId);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size?.success && size.data ? size.data : null} />
      </div>
    </Suspense>
  );
};

export default SizeDetailsPage;
