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

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <TokenIsInvalidState message="No verification token provided" />;
  }

  return (
    <main className="container py-8">
      <Suspense fallback={ <Loader /> }>
        <VerificationContent token={ token } />
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
  <Card className="mx-auto mt-8 max-w-md">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
    </CardHeader>
    <CardContent>{ children }</CardContent>
  </Card>
);

const TokenIsInvalidState = ({ message }: { message?: string }) => (
  <VerificationCard>
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertDescription>{ message || "The verification link is invalid or has expired." }</AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="text-muted-foreground mb-4">Please try signing up again with a new verification link.</p>
      <Link className={ buttonVariants() } href="/auth/sign-up">
        Sign Up Again
      </Link>
    </div>
  </VerificationCard>
);

const VerificationSuccess = () => (
  <VerificationCard>
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-600">Your email has been successfully verified!</AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="text-muted-foreground mb-4">You can now sign in to your account.</p>
      <Link className={ buttonVariants() } href="/auth/sign-in/email">
        Sign In
      </Link>
    </div>
  </VerificationCard>
);
