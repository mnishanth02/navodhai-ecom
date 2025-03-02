"use client";

import { deleteStoreAction, updateStoreAction } from "@/actions/store.action";
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
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SettingsFormProps {
  initialData: StoreType;
}

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: StoreSchemaType) => {
    startTransition(async () => {
      try {
        const result = await updateStoreAction({
          name: data.name,
          storeId: initialData.id,
        });

        if (result.success) {
          router.refresh();
          toast.success(result.message || "Store updated successfully");
        } else {
          toast.error(result.error?.serverError?.message || "Something went wrong");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        toast.error(errorMessage);
      }
    });
  };

  const onDelete = async () => {
    setIsDeleting(true);
    startTransition(async () => {
      try {
        const result = await deleteStoreAction(initialData.id);

        if (result.success) {
          // router.refresh();
          router.push("/");
          toast.success(result.message || "Store deleted successfully");
        } else {
          toast.error(result.error?.serverError?.message || "Something went wrong");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setOpen(false);
        setIsDeleting(false);
      }
    });
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isDeleting} />
      <div className="flex-between">
        <PageHeading title="Settings" description="Manage store preferences" />

        <Button variant="destructive" size="icon" disabled={isPending || isDeleting} onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <InputWithLabel
              fieldTitle="Store Name"
              disabled={isPending || isDeleting}
              nameInSchema="name"
              placeholder="Store Name"
            />
          </div>
          <Button type="submit" disabled={isPending || isDeleting}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
