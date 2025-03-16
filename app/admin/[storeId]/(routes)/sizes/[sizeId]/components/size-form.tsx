"use client";
import { InputWithLabel } from "@/components/common/input-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import PageHeading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { createSize, deleteSize, updateSize } from "@/data/actions/size.actions";

import type { SizeType } from "@/drizzle/schema/store";
import { SizeSchema, type SizeSchemaType } from "@/lib/validator/store-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface SizeFormProps {
  initialData: SizeType | null;
}

const SizeForm = ({ initialData }: SizeFormProps) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const pageTitle = initialData ? "Edit size" : "Create size";
  const pageDescription = initialData ? "Edit size" : "Add a new size";
  const toastMessage = initialData ? "size updated." : "size created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeSchemaType>({
    resolver: zodResolver(SizeSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          value: initialData.value || "",
        }
      : {
          name: "",
          value: "",
        },
  });

  const { execute: executeCreate } = useAction(createSize, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
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

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateSize, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      router.push(`/admin/${params.storeId}/sizes`);
      // router.refresh();
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

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteSize, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Billboard deleted successfully");
      router.push(`/admin/${params.storeId}/sizes`);
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

  const onSubmit = async (data: SizeSchemaType) => {
    setServerError(null);

    const submitData = {
      name: data.name,
      value: data.value,
      storeId: params.storeId as string,
    };

    if (initialData) {
      await executeUpdate({
        ...submitData,
        sizeId: initialData.id,
      });
    } else {
      await executeCreate(submitData);
    }
  };

  const onDelete = () => {
    executeDelete({ sizeId: initialData?.id ?? "", storeId: params.storeId as string });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <div className="flex-between">
        <PageHeading title={pageTitle} description={pageDescription} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isUpdating || isDeleting}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator className="" />
      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {serverError}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <InputWithLabel
              fieldTitle="Name"
              disabled={isUpdating || isDeleting}
              nameInSchema="name"
              placeholder="Size Name"
            />
            <InputWithLabel
              fieldTitle="Value"
              disabled={isUpdating || isDeleting}
              nameInSchema="value"
              placeholder="Size Value"
            />
          </div>
          <Button type="submit" disabled={isUpdating || isDeleting}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{action}</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
