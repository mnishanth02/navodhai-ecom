"use client";
import Heading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { type ColorsColumn, columns } from "./columns";

interface ColorsClientProps {
  data: ColorsColumn[];
}

const ColorsClient = ({ data }: ColorsClientProps) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <div className="flex-between">
        <Heading title={`Colors (${data.length})`} description="Manage colors for your store" />
        <Button
          size={isMobile ? "icon" : "default"}
          onClick={() => router.push(`/admin/${params.storeId}/colors/new`)}
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

export default ColorsClient;
