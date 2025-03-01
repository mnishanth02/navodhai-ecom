"use client";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { InputWithLabel } from "@/components/common/input-with-label";
import { useStoreModal } from "@/store/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
            <InputWithLabel fieldTitle="Name" nameInSchema="name" placeholder="E-commerce Store" />
            <div className="flex items-center justify-end gap-x-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
