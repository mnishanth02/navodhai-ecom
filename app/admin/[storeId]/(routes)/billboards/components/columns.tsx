"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { CellAction } from "./cell-action";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
  isHome: boolean;
};

interface BillboardTableState {
  selectedBillboardId: string | null;
  onCheckboxChange: (id: string | null) => void;
  isUpdating: boolean;
  updatingId: string | null;
}

interface BillboardTableMeta {
  state: BillboardTableState;
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "isHome",
    header: "Home Billboard",
    cell: ({ row, table }) => {
      const meta = table.options.meta as BillboardTableMeta;
      if (!meta) return null;

      const isSelected = meta.state.selectedBillboardId === row.original.id;
      const isUpdating = meta.state.isUpdating && meta.state.updatingId === row.original.id;

      return (
        <div className="">
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Checkbox
              className="h-4 w-4 cursor-pointer"
              checked={isSelected}
              onCheckedChange={(checked) => {
                meta.state.onCheckboxChange(checked ? row.original.id : null);
              }}
              aria-label="Select as home billboard"
              disabled={meta.state.isUpdating}
            />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
