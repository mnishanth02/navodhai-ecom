"use client";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { createStore } from "@/actions/store.actions";
import { InputWithLabel } from "@/components/common/input-with-label";
import { StoreSchema, StoreSchemaType } from "@/lib/validator/store-validator";
import { useStoreModal } from "@/hooks/store/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@ui/modal";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const { execute } = useAction(createStore, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Store created successfully");
      form.reset();
      onClose();

      // Navigate to the new store
      if (data.data?.store?.id) {
        window.location.assign(`/${data.data.store.id}`);
      } else {
        // Fallback to refresh the page if we can't get the store ID
        window.location.reload();
      }
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
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: StoreSchemaType) => {
    execute(values);
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={ isOpen }
      onClose={ onClose }
    >
      <div className="space-y-4 py-2 pb-4">
        { serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{ serverError }</div> }
        <Form { ...form }>
          <form onSubmit={ form.handleSubmit(onSubmit) }>
            <InputWithLabel
              fieldTitle="Name"
              disabled={ isSubmitting }
              nameInSchema="name"
              placeholder="E-commerce Store"
            />
            <div className="flex items-center justify-end gap-x-2 pt-6">
              <Button type="button" variant="outline" onClick={ onClose }>
                Cancel
              </Button>
              <Button disabled={ isSubmitting } type="submit">
                { isSubmitting ? "Loading..." : "Continue" }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
