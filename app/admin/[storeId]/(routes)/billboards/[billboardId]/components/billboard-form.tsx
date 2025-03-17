"use client";

import { FileUpload } from "@/components/common/file-upload";
import { InputWithLabel } from "@/components/common/input-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import PageHeading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  createBillboard,
  deleteBillboard,
  updateBillboard,
} from "@/data/actions/billboard.actions";
import type { BillboardType } from "@/drizzle/schema/store";
import { BillboardSchema, type BillboardSchemaType } from "@/lib/validator/store-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface BillboardFormProps {
  initialData: BillboardType | null | undefined;
}

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(
    initialData?.imageUrls || [],
  );
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    initialData?.primaryImageUrl || "",
  );

  const pageTitle = initialData ? "Edit billboard" : "Create billboard";
  const pageDescription = initialData ? "Edit billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardSchemaType>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          imageUrls: initialData.imageUrls || [],
          primaryImageUrl: initialData.primaryImageUrl || "",
        }
      : {
          label: "",
          imageUrls: [],
          primaryImageUrl: "",
        },
  });

  // Update form value when images are uploaded
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      form.setValue("imageUrls", uploadedImageUrls);
    } else {
      form.setValue("imageUrls", []);
    }
  }, [uploadedImageUrls, form]);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateBillboard, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      router.push(`/admin/${params.storeId}/billboards`);
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

  const { execute: executeCreate } = useAction(createBillboard, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      form.reset();
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

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteBillboard, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Billboard deleted successfully");
      router.push(`/admin/${params.storeId}/billboards`);
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

  const onSubmit = async (data: BillboardSchemaType) => {
    setServerError(null);

    const submitData = {
      label: data.label,
      imageUrls: uploadedImageUrls,
      primaryImageUrl: primaryImageUrl,
      storeId: params.storeId as string,
    };

    if (initialData) {
      await executeUpdate({
        ...submitData,
        billboardId: initialData.id,
      });
    } else {
      await executeCreate(submitData);
    }
  };

  const onDelete = () => {
    executeDelete({ billboardId: initialData?.id ?? "" });
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
            <div className="col-span-3 space-y-2">
              <label className="font-medium text-sm">Billboard Images</label>
              <FileUpload
                folder="billboards"
                disabled={isUpdating || isDeleting}
                initialFileUrls={uploadedImageUrls}
                primaryImageUrl={primaryImageUrl}
                multiple={true}
                onUploadComplete={(fileUrls, newPrimaryUrl) => {
                  // Use requestAnimationFrame to ensure state updates are batched
                  requestAnimationFrame(() => {
                    setUploadedImageUrls(fileUrls);
                    if (newPrimaryUrl || (!primaryImageUrl && fileUrls.length > 0)) {
                      const primaryUrl = newPrimaryUrl || fileUrls[0];
                      setPrimaryImageUrl(primaryUrl);
                      form.setValue("primaryImageUrl", primaryUrl);
                    }
                  });
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
              {uploadedImageUrls.length > 0 && (
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm">
                    {uploadedImageUrls.length} {uploadedImageUrls.length === 1 ? "image" : "images"}{" "}
                    uploaded
                  </p>
                </div>
              )}
              {(form.formState.errors.imageUrls || form.formState.errors.primaryImageUrl) && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.imageUrls?.message ||
                    form.formState.errors.primaryImageUrl?.message}
                </p>
              )}
            </div>
            <InputWithLabel
              fieldTitle="Label"
              disabled={isUpdating || isDeleting}
              nameInSchema="label"
              placeholder="Billboard Label"
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

export default BillboardForm;
