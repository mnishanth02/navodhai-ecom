"use client";

import { FileUpload } from "@/components/common/file-upload";
import { InputWithLabel } from "@/components/common/input-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import PageHeading from "@/components/store/page-heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createProduct, deleteProduct, updateProduct } from "@/data/actions/product.actions";

import type { ProductWithImages } from "@/data/data-access/products.queries";
import type { CategoryType, ColorType, SizeType } from "@/drizzle/schema/store";
import { ProductSchema, type ProductSchemaType } from "@/lib/validator/store-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface ProductFormProps {
  initialData: ProductWithImages | null;
  categories: CategoryType[];
  sizes: SizeType[];
  colors: ColorType[];
}

const ProductForm = ({ initialData, categories, colors, sizes }: ProductFormProps) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(
    initialData?.images.map((i) => i.url) || [],
  );

  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    initialData?.primaryImageUrl || "",
  );
  const pageTitle = initialData ? "Edit product" : "Create product";
  const pageDescription = initialData ? "Edit product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          primaryImageUrl: initialData.primaryImageUrl ?? undefined,
          price: Number.parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          primaryImageUrl: "",
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  // Update form value when images are uploaded
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      form.setValue(
        "images",
        uploadedImageUrls.map((url) => ({ url })),
      );
    } else {
      form.setValue("images", []);
    }
  }, [uploadedImageUrls, form]);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateProduct, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      router.push(`/admin/${params.storeId}/products`);
      form.reset();
      setUploadedImageUrls([]);
      setPrimaryImageUrl("");
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

  const { execute: executeCreate } = useAction(createProduct, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      form.reset();
      setUploadedImageUrls([]);
      setPrimaryImageUrl("");
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

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteProduct, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Product deleted successfully");
      router.push(`/admin/${params.storeId}/products`);
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

  const onSubmit = async (data: ProductSchemaType) => {
    setServerError(null);

    const submitData = {
      ...data,
      storeId: params.storeId as string,
    };

    if (initialData) {
      await executeUpdate({
        ...submitData,
        productId: initialData.id,
        storeId: params.storeId as string,
      });
    } else {
      await executeCreate(submitData);
    }
  };

  const onDelete = () => {
    executeDelete({ productId: initialData?.id ?? "" });
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
              <Label>Images</Label>
              <FileUpload
                key={uploadedImageUrls.length}
                folder="products"
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
              {(form.formState.errors.images || form.formState.errors.primaryImageUrl) && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.images?.message ||
                    form.formState.errors.primaryImageUrl?.message}
                </p>
              )}
            </div>
            <InputWithLabel
              fieldTitle="Name"
              disabled={isUpdating || isDeleting}
              nameInSchema="name"
              placeholder="Product Name"
            />
            <InputWithLabel
              fieldTitle="Price"
              type="number"
              min="0"
              disabled={isUpdating || isDeleting}
              nameInSchema="price"
              placeholder="200"
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isUpdating || isDeleting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-60 md:w-full">
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isUpdating || isDeleting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-60 md:w-full">
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isUpdating || isDeleting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-60 md:w-full">
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex flex-row">
                            {color.name}
                            <div
                              className="mt-1 ml-2 h-4 w-4 rounded-full border"
                              style={{ backgroundColor: color.value }}
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex w-60 flex-row items-center space-x-3 space-y-0 rounded-md border p-4 md:w-full">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex w-60 flex-row items-center space-x-3 space-y-0 rounded-md border p-4 md:w-full">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
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

export default ProductForm;
