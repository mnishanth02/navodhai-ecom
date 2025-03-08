import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { findVerificationTokenByToken } from "@/data/data-access/auth.queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;

  // If no token is provided, show the forgot password form
  if (!token) {
    return (
      <div className="relative container flex min-h-[80vh] flex-col items-center justify-center">
        <Link
          href="/auth/sign-in/email"
          className={ buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "absolute top-4 left-4 md:top-8 md:left-8",
          }) }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ForgotPasswordForm />
            </CardContent>
          </Card>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Remember your password?{ " " }
            <Link href="/auth/sign-in/email" className="hover:text-brand underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // If token is provided, verify it and show the reset password form
  const verificationTokenResponse = await findVerificationTokenByToken(token);

  if (!verificationTokenResponse.success || !verificationTokenResponse.data) {
    return <TokenIsInvalidState />;
  }

  const verificationToken = verificationTokenResponse.data;

  if (new Date(verificationToken.expires) < new Date()) {
    return <TokenIsInvalidState />;
  }

  return (
    <div className="relative container flex min-h-[80vh] flex-col items-center justify-center">
      <Link
        href="/auth/sign-in/email"
        className={ buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "absolute top-4 left-4 md:top-8 md:left-8",
        }) }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground text-sm">Create a new password for your account</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <ResetPasswordForm email={ verificationToken.identifier } token={ token } />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const TokenIsInvalidState = () => {
  return (
    <div className="relative container flex min-h-[80vh] flex-col items-center justify-center">
      <Link
        href="/auth/sign-in/email"
        className={ buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "absolute top-4 left-4 md:top-8 md:left-8",
        }) }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Invalid Reset Link</h1>
          <p className="text-muted-foreground text-sm">The password reset link is invalid or has expired</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-destructive bg-destructive/10 rounded-md p-4 text-sm">
              <p className="mb-4">Please request a new password reset link to continue.</p>
              <Link href="/auth/forgot-password" className={ buttonVariants({ className: "w-full" }) }>
                Request New Link
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Remember your password?{ " " }
          <Link href="/auth/sign-in/email" className="hover:text-brand underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
