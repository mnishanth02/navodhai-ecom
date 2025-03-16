"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryColumn } from "./columns";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBillboard } from "@/data/actions/billboard.actions";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteBillboard, {
    onSuccess: (data) => {
      toast.success(data.data?.message || "Billboard deleted successfully");
      router.push(`/admin/${params.storeId}/categories`);
    },
    onError: (error) => {
      if (error.error?.serverError) {
        toast.error(error.error.serverError);
      } else {
        toast.error("Make sure you removed all categories using this billboard first.");
      }
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard ID copied to the clipboard.");
  };

  const onDelete = async () => {
    executeDelete({
      billboardId: data.id,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/${params.storeId}/categories/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)} className="!text-red-500">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
