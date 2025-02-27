"use client";

import { resetPasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export const ResetPasswordForm = ({ email, token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    setServerError(null);

    try {
      const res = await resetPasswordAction(email, token, values);

      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        form.reset();
        router.push("/auth/sign-in/email");
      } else {
        if (res.error?.validationErrors) {
          // Handle validation errors
          Object.entries(res.error.validationErrors).forEach(([field, messages]) => {
            if (field in values) {
              form.setError(field as keyof ResetPasswordSchemaType, {
                message: messages[0],
              });
            }
          });
        } else if (res.error?.serverError) {
          // Handle server errors
          setServerError(res.error.serverError.message);
        } else {
          // Fallback error
          setServerError("Failed to reset password");
        }
      }
    } catch {
      setServerError("An unexpected error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{serverError}</div>}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your new password" className="h-11" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Must be at least 8 characters with 1 number and 1 special character
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your new password" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
};
