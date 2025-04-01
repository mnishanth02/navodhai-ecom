"use client";

import { DataTable } from "@/components/ui/data-table";
import { updateBillboardHomeStatusAction } from "@/data/actions/billboard.actions";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { type BillboardColumn, columns } from "./columns";

interface BillboardTableProps {
  data: BillboardColumn[];
}

interface BillboardTableState {
  selectedBillboardId: string | null;
  onCheckboxChange: (id: string | null) => void;
  isUpdating: boolean;
  updatingId: string | null;
}

export function BillboardTable({ data }: BillboardTableProps) {
  const params = useParams();
  const [selectedBillboardId, setSelectedBillboardId] = useState<string | null>(
    data.find((billboard) => billboard.isHome)?.id || null,
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(
    updateBillboardHomeStatusAction,
    {
      onSuccess: (result) => {
        setSelectedBillboardId(result.data?.billboard?.id || null);
        toast.success(result.data?.message || "Billboard home status updated successfully");
        setUpdatingId(null);
      },
      onError: (error) => {
        toast.error(error.error?.serverError || "Failed to update billboard home status");
        // Revert the checkbox state on error
        setSelectedBillboardId(selectedBillboardId);
        setUpdatingId(null);
      },
      onSettled: () => {
        setUpdatingId(null);
      },
    },
  );

  const handleCheckboxChange = async (id: string | null) => {
    if (!params.storeId) return;
    setUpdatingId(id);
    await executeUpdate({
      billboardId: id || "",
      storeId: params.storeId as string,
      isHome: !!id,
    });
  };

  // Create a state object that will be passed to columns
  const tableState: BillboardTableState = {
    selectedBillboardId,
    onCheckboxChange: handleCheckboxChange,
    isUpdating,
    updatingId,
  };

  return <DataTable columns={columns} data={data} searchKey="label" meta={{ state: tableState }} />;
}
