import Loader from "@/components/common/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteVerificationTokenByIdentifier,
  findVerificationTokenByToken,
  verifyCredentialsEmailAction,
} from "@/data/data-access/auth.queries";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email | Navodhai",
  description: "Verify your email address for your Navodhai account",
};

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <TokenIsInvalidState message="No verification token provided" />;
  }

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-8">
      <Suspense
        fallback={
          <VerificationCard>
            <Loader className="mx-auto my-8" />
          </VerificationCard>
        }
      >
        <VerificationContent token={token} />
      </Suspense>
    </main>
  );
}

async function VerificationContent({ token }: { token: string }) {
  try {
    // Find verification token
    const verificationTokenResponse = await findVerificationTokenByToken(token);
    if (!verificationTokenResponse.success || !verificationTokenResponse.data) {
      return <TokenIsInvalidState message="Invalid verification token" />;
    }

    const verificationToken = verificationTokenResponse.data;

    // Check if token is expired
    if (
      !verificationToken.expires ||
      new Date(verificationToken.expires) < new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      return <TokenIsInvalidState message="Verification token has expired" />;
    }

    // Verify email using direct server action
    const verificationResult = await verifyCredentialsEmailAction(token);
    if (!verificationResult.success) {
      console.error("[Email Verification Error]", verificationResult.error);
      return <TokenIsInvalidState message="Failed to verify email" />;
    }

    // Delete verification token
    await deleteVerificationTokenByIdentifier(verificationToken.identifier);

    return <VerificationSuccess />;
  } catch (error) {
    console.error("[Email Verification Error]", error);
    return <TokenIsInvalidState message="An unexpected error occurred during email verification" />;
  }
}

const VerificationCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="mx-auto max-w-md shadow-md">
    <CardHeader>
      <CardTitle className="text-center font-bold text-2xl">Email Verification</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const TokenIsInvalidState = ({ message }: { message?: string }) => (
  <VerificationCard>
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertDescription>
        {message || "The verification link is invalid or has expired."}
      </AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="mb-4 text-muted-foreground">
        Please try signing up again with a new verification link.
      </p>
      <Link className={buttonVariants()} href="/auth/sign-up">
        Sign Up Again
      </Link>
    </div>
  </VerificationCard>
);

const VerificationSuccess = () => (
  <VerificationCard>
    <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-950 dark:bg-green-950/50">
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
      <AlertDescription className="text-green-600 dark:text-green-500">
        Your email has been successfully verified!
      </AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="mb-4 text-muted-foreground">You can now sign in to your account.</p>
      <Link className={buttonVariants()} href="/auth/sign-in/email">
        Sign In
      </Link>
    </div>
  </VerificationCard>
);
