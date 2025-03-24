"use client";
import Heading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { type SizesColumn, columns } from "./columns";

interface SizesClientProps {
  data: SizesColumn[];
}

const SizesClient = ({ data }: SizesClientProps) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <div className="flex-between">
        <Heading title={`Sizes (${data.length})`} description="Manage sizes for your store" />
        <Button
          size={isMobile ? "icon" : "default"}
          onClick={() => router.push(`/admin/${params.storeId}/sizes/new`)}
        >
          {isMobile ? <Plus className="h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {!isMobile && "Add New"}
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};

export default SizesClient;
