"use client";

import AppDialog from "../common/app-dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ActionResult, signupAction } from "@/actions/auth.actions";
import { SignupSchema, SignupSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="h-11 w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create account"
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

export const SignUpForm: FC = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (_: ActionResult, formData: FormData): Promise<ActionResult> => {
    const result = await signupAction(formData);

    if (result.success) {
      toast.success("Account created successfully!");
      setIsDialogOpen(true);
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

  const [, formAction] = useActionState(handleSignup, initialState);

  return (
    <>
      <Form {...form}>
        <form action={formAction} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      placeholder="Enter your name"
                      type="text"
                      autoComplete="name"
                      className="h-11"
                    />
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
                      name="email"
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
                      name="password"
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

          <SubmitButton />
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
