import { redirect } from "next/navigation";

export const metadata = {
  title: "Reset Password | Navodhai",
  description: "Reset your Navodhai account password",
};

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return redirect("/auth/sign-in");
  }

  // Redirect to forgot-password page with the token
  return redirect(`/auth/forgot-password?token=${token}`);
}
