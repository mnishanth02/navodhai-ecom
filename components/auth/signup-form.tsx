"use client";

import AppDialog from "../common/app-dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { signupAction } from "@/actions/auth.actions";
import { SignupSchema, SignupSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignUpForm: FC = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signupAction(formData);

      if (result.success) {
        toast.success("Account created successfully!");
        form.reset();
        setIsDialogOpen(true);
      } else if (result.error) {
        if (result.error.validationErrors) {
          // Set form errors for each field
          const errors = result.error.validationErrors;

          Object.entries(errors).forEach(([field, messages]) => {
            if (field === "name" || field === "email" || field === "password") {
              form.setError(field as keyof SignupSchemaType, {
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{serverError}</div>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" type="text" autoComplete="name" className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      className="h-11"
                    />
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
                      placeholder="Create a password"
                      type="password"
                      autoComplete="new-password"
                      className="h-11"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Welcome! 🎉"
        message="We've sent you a verification email. Please check your inbox to activate your account."
        showSecondaryButton={false}
        primaryButton={{
          text: "Continue to Sign In",
          variant: "default",
          onClick: () => router.push("/auth/sign-in/email"),
        }}
        className="sm:max-w-md"
      />
    </>
  );
};
