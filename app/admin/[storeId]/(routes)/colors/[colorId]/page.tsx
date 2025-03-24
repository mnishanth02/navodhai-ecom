import Loader from "@/components/common/loader";
import { getColorByIdQuery } from "@/data/data-access/color.queries";
import { Suspense } from "react";
import ColorForm from "./components/color-form";

interface ColorDetailsPageProps {
  params: Promise<{ colorId: string }>;
}

const ColorDetailsPage = async ({ params }: ColorDetailsPageProps) => {
  const { colorId } = await params;

  const color = await getColorByIdQuery(colorId);
  console.log("color", color);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color?.success && color.data ? color.data : null} />
      </div>
    </Suspense>
  );
};

export default ColorDetailsPage;
