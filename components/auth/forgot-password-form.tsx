"use client";

import AppDialog from "../common/app-dialog";
import { forgotPasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await forgotPasswordAction(formData);

      if (result.success) {
        toast.success(result.message || "Password reset email sent successfully");
        form.reset();
        setIsDialogOpen(false);
      } else if (result.error) {
        if (result.error.validationErrors) {
          // Set form errors for each field
          const errors = result.error.validationErrors;

          Object.entries(errors).forEach(([field, messages]) => {
            if (field === "email") {
              form.setError(field as keyof ForgotPasswordSchemaType, {
                type: "server",
                message: messages.message,
              });
            }
          });
        } else if (result.error.serverError) {
          setServerError(result.error.serverError.message);
        } else {
          setServerError("Something went wrong");
        }
      }
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <Form {...form}>
      <form className="space-y-4">
        {serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{serverError}</div>}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your email" type="email" autoComplete="email" className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="button" onClick={form.handleSubmit(onSubmit)} className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
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
