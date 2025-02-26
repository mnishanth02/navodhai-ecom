"use client";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ActionResult, signinAction } from "@/actions/auth.actions";
import { SigninSchema, SigninSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Submit Button Component with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="h-11 w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign in"
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

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (_: ActionResult, formData: FormData): Promise<ActionResult> => {
    const result = await signinAction(formData);
    // console.log(result);

    if (result.success) {
      toast.success("Login Successful");
      form.reset();
      router.push(callbackUrl || "/profile");
    } else if (result.error) {
      if (result.error.validationErrors) {
        const errors = Object.values(result.error.validationErrors).flat();
        console.log(errors);

        toast.error(errors.join(", "));
      } else if (result.error.serverError) {
        toast.error(result.error.serverError.message);
      } else {
        toast.error("Something went wrong");
      }
    }

    return result;
  };

  const [, formAction] = useActionState(handleSignin, initialState);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <div className="space-y-4">
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
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11"
                  />
                </FormControl>
                {/* <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="text-muted-foreground hover:text-primary flex justify-end px-0 font-normal"
                >
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button> */}
                <ForgotPasswordForm />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton />
      </form>
    </Form>
  );
};
