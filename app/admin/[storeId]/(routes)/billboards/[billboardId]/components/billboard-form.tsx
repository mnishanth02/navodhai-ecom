"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import PageHeading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BillboardSchema, BillboardSchemaType } from "@/lib/validator/store-validator";
import { BillboardType } from "@/drizzle/schema/store";
import { updateBillboard, deleteBillboard, createBillboard } from "@/data/actions/billboard.actions";
import { FileUpload } from "@/components/common/file-upload";
import { R2UploadExample } from "@/components/examples/r2-upload-example";
interface BillboardFormProps {
    initialData: BillboardType | null | undefined
}

const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialData?.imageUrl || null);

    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated." : "Billboard created."
    const action = initialData ? "Save changes" : "Create"


    const form = useForm<BillboardSchemaType>({
        resolver: zodResolver(BillboardSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        },
    });
    
    // Update form value when image is uploaded
    useEffect(() => {
        if (uploadedImageUrl) {
            form.setValue("imageUrl", uploadedImageUrl);
        }
    }, [uploadedImageUrl, form]);

    const { execute: executeUpdate, isPending: isUpdating } = useAction(updateBillboard, {
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

    const { execute: executeCreate, isPending: isCreating } = useAction(createBillboard, {
        onExecute: () => {
            setServerError(null);
        },
        onSuccess: (data) => {
            toast.success(data.data?.message || "Billboard created successfully");
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

    const onSubmit = (data: BillboardSchemaType) => {

        if (initialData) {
            executeUpdate({
                label: data.label,
                imageUrl: data.imageUrl,
                billboardId: initialData?.id ?? "",
            });
        } else {
            executeCreate({
                label: data.label,
                imageUrl: data.imageUrl,
                storeId: params.storeId as string,
            });
        }
    };

    const onDelete = () => {
        executeDelete({ billboardId: initialData?.id ?? "" });
    };

    return (
        <>
            <AlertModal isOpen={ open } onClose={ () => setOpen(false) } onConfirm={ onDelete } loading={ isDeleting } />
            <div className="flex-between">
                <PageHeading title={ title } description={ description } />

                { initialData && (
                    <Button variant="destructive" size="icon" disabled={ isUpdating || isDeleting } onClick={ () => setOpen(true) }>
                        <Trash className="h-4 w-4" />
                    </Button>
                ) }
            </div>
            <Separator className="" />
            { serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{ serverError }</div> }
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-3 space-y-2">
                            <label className="text-sm font-medium">Billboard Image</label>
                            <FileUpload
                                folder="billboards"
                                disabled={ isUpdating || isDeleting }
                                initialFileUrl={ initialData?.imageUrl || undefined }
                                onUploadComplete={(fileUrl) => {
                                    setUploadedImageUrl(fileUrl);
                                }}
                                onUploadError={(error) => {
                                    toast.error(`Upload failed: ${error.message}`);
                                }}
                            />
                            {form.formState.errors.imageUrl && (
                                <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>
                            )}
                        </div>
                        <InputWithLabel
                            fieldTitle="Label"
                            disabled={ isUpdating || isDeleting }
                            nameInSchema="label"
                            placeholder="Billboard Label"
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

            <Separator className="" />
            <R2UploadExample />

        </>
    );
};

export default BillboardForm;
