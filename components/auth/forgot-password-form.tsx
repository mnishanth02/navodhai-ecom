"use client";

import AppDialog from "../common/app-dialog";
import { forgotPassword } from "@/data/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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

  const { execute } = useAction(forgotPassword, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Password reset email sent successfully");
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
      } else {
        setServerError("Something went wrong");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    execute(data);
  };

  const formContent = (
    <Form { ...form }>
      <form className="space-y-4">
        { serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{ serverError }</div> }

        <div className="space-y-4">
          <FormField
            control={ form.control }
            name="email"
            render={ ({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input { ...field } placeholder="Enter your email" type="email" autoComplete="email" className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
        </div>

        <Button type="button" onClick={ form.handleSubmit(onSubmit) } className="h-11 w-full" disabled={ isSubmitting }>
          { isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send Reset Link"
          ) }
        </Button>
      </form>
    </Form>
  );

  return (
    <AppDialog
      trigger={ <span className="flex-1 text-end text-sm hover:cursor-pointer hover:underline">Forgot Password</span> }
      title="Enter Your Email"
      message="We will send you an email with a link to reset your password."
      open={ isDialogOpen }
      onOpenChange={ setIsDialogOpen }
      showButtons={ false }
      customContent={ formContent }
    />
  );
};
