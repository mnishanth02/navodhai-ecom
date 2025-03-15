"use client";
import Heading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex-between">
      <Heading title="Billboards (0)" description="Manage billboards for your store" />
      <Button
        size={isMobile ? "icon" : "default"}
        onClick={() => router.push(`/admin/${params.storeId}/billboards/new`)}
      >
        {isMobile ? <Plus className="h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
        {!isMobile && "Add New"}
      </Button>
    </div>
  );
};

export default BillboardClient;
