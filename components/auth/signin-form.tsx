"use client";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ForgotPasswordForm } from "./forgot-password-form";
import { signinAction } from "@/actions/auth.actions";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { SigninSchema, SigninSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SigninSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signinAction(formData);

      if (result.success) {
        toast.success("Login Successful");
        form.reset();
        window.location.href = callbackUrl || DEFAULT_SIGNIN_REDIRECT;
        // router.push(callbackUrl || "/");
      } else if (result.error) {
        if (result.error.validationErrors) {
          // Set form errors for each field
          const errors = result.error.validationErrors;

          Object.entries(errors).forEach(([field, messages]) => {
            if (field === "email" || field === "password") {
              form.setError(field as keyof SigninSchemaType, {
                type: "server",
                message: messages[0],
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && <div className="text-primary bg-destructive rounded-md p-3 text-sm">{serverError}</div>}

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11"
                  />
                </FormControl>
                {/* <div className="flex justify-end">
                  <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div> */}
                <ForgotPasswordForm />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
};
