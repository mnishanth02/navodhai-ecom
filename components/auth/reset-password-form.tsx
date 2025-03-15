"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/data/actions/auth.actions";
import { ResetPasswordSchema, type ResetPasswordSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const { execute } = useAction(resetPassword, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Password reset successfully");
      form.reset();
      router.push("/auth/sign-in/email");
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
      } else if (error.error?.validationErrors) {
        // Handle validation errors if needed
        for (const [field, validationError] of Object.entries(error.error.validationErrors)) {
          if (field in form.getValues()) {
            form.setError(field as keyof ResetPasswordSchemaType, {
              message: String(validationError),
            });
          }
        }
      } else {
        setServerError("An unexpected error occurred");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: ResetPasswordSchemaType) => {
    execute({
      email,
      token,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    className="h-11"
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
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
