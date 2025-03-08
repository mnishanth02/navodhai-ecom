"use client";

import { deleteStore, updateStore } from "@/data/actions/store.actions";
import { InputWithLabel } from "@/components/common/input-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import PageHeading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { StoreType } from "@/drizzle/schema/store";
import { StoreSchema, StoreSchemaType } from "@/lib/validator/store-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SettingsFormProps {
  initialData: StoreType;
}

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: initialData,
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateStore, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Store updated successfully");
      router.refresh();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteStore, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Store deleted successfully");
      router.push("/");
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onSubmit = (data: StoreSchemaType) => {
    executeUpdate({
      name: data.name,
      storeId: initialData.id,
    });
  };

  const onDelete = () => {
    executeDelete({ storeId: initialData.id });
  };

  return (
    <>
      <AlertModal isOpen={ open } onClose={ () => setOpen(false) } onConfirm={ onDelete } loading={ isDeleting } />
      <div className="flex-between">
        <PageHeading title="Settings" description="Manage store preferences" />

        <Button variant="destructive" size="icon" disabled={ isUpdating || isDeleting } onClick={ () => setOpen(true) }>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="mb-6" />
      { serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{ serverError }</div> }
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <InputWithLabel
              fieldTitle="Store Name"
              disabled={ isUpdating || isDeleting }
              nameInSchema="name"
              placeholder="Store Name"
            />
          </div>
          <Button type="submit" disabled={ isUpdating || isDeleting }>
            { isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            ) }
          </Button>
        </form>
      </Form>

    </>
  );
};

export default SettingsForm;
