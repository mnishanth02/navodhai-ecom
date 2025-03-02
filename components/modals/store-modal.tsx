"use client";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { createStoreAction } from "@/actions/store.action";
import { InputWithLabel } from "@/components/common/input-with-label";
import { StoreSchema, StoreSchemaType } from "@/lib/validator/store-validator";
import { useStoreModal } from "@/store/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@ui/modal";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: StoreSchemaType) => {
    try {
      startTransition(async () => {
        const result = await createStoreAction(values.name);

        if (result.success) {
          toast.success(result.message || "Store created successfully");
          form.reset();
          onClose();
          window.location.assign(`/${result.data?.id}`);
        } else {
          if (result.error.validationErrors) {
            // Handle validation errors
            result.error.validationErrors.forEach((error) => {
              toast.error(error.message);
            });
          } else {
            toast.error(result.error.serverError?.message || "Failed to create store");
          }
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputWithLabel fieldTitle="Name" disabled={isPending} nameInSchema="name" placeholder="E-commerce Store" />
            <div className="flex items-center justify-end gap-x-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Loading..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
