"use client";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ForgotPasswordForm } from "./forgot-password-form";
import { signin } from "@/data/actions/auth.actions";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { SigninSchema, SigninSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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

  const { execute } = useAction(signin, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Login Successful");
      form.reset();
      window.location.href = callbackUrl || DEFAULT_SIGNIN_REDIRECT;
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

  const onSubmit = (data: SigninSchemaType) => {
    execute(data);
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4">
        { serverError && <div className="text-primary bg-destructive rounded-md p-3 text-sm">{ serverError }</div> }

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

          <FormField
            control={ form.control }
            name="password"
            render={ ({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    { ...field }
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11"
                  />
                </FormControl>
                <ForgotPasswordForm />
                <FormMessage />
              </FormItem>
            ) }
          />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={ isSubmitting }>
          { isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          ) }
        </Button>
      </form>
    </Form>
  );
};
