"use client";

import { ActionResult, forgotPasswordAction } from "@/actions/auth.actions";
import AppDialog from "@/components/common/app-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending email...
        </>
      ) : (
        "Send Password Reset Email"
      )}
    </Button>
  );
}

// Initial state matching ActionResult type
const initialState: ActionResult = {
  success: false,
  message: undefined,
  error: undefined,
};

export const ForgotPasswordForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleForgotPassword = async (_: ActionResult, formData: FormData): Promise<ActionResult> => {
    const result = await forgotPasswordAction(formData);

    if (result.success) {
      toast.success(result.message || "Password reset email sent successfully");
      form.reset();
    } else if (result.error) {
      if (result.error.validationErrors) {
        const errors = Object.values(result.error.validationErrors).flat();
        toast.error(errors.join(", "));
      } else if (result.error.serverError) {
        toast.error(result.error.serverError.message);
      }
    }

    return result;
  };

  const [, formAction] = useActionState(handleForgotPassword, initialState);

  const formContent = (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton />
      </form>
    </Form>
  );

  return (
    <AppDialog
      trigger={<span className="flex-1 text-end text-sm hover:cursor-pointer hover:underline">Forgot Password</span>}
      title="Enter Your Email"
      message="We will send you an email with a link to reset your password."
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      showButtons={false}
      customContent={formContent}
    />
  );
};
