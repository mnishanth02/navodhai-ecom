import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import Link from "next/link";
import type * as React from "react";

interface ForgotPasswordEmailProps {
  token: string;
  verificationTokenExpMin: number;
  baseUrl: string;
}

export const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({
  token,
  verificationTokenExpMin,
  baseUrl,
}) => {
  const currentYear = new Date().getFullYear();
  const resetUrl = `${baseUrl}/auth/forgot-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Reset Your Password - Navodhai Store</Preview>
      <Tailwind>
        <Body className="bg-yellow-50 font-sans">
          <Container className="mx-auto p-5">
            <Section className="mx-auto max-w-600 rounded-lg bg-white shadow-sm">
              {/* Header */}
              <Section className="rounded-t-lg bg-yellow-500 px-8 py-10 text-center">
                <Heading className="m-0 font-bold text-2xl text-white">
                  Password Reset Request
                </Heading>
              </Section>

              {/* Content */}
              <Section className="px-8 py-10">
                <Text className="mb-5 text-base text-gray-800 leading-6">Hi there,</Text>
                <Text className="mb-5 text-base text-gray-800 leading-6">
                  We received a request to reset your password for your Navodhai Store account.
                  Click the button below to reset your password.
                </Text>
                <Text className="mb-8 text-base text-gray-800 leading-6">
                  This password reset link will expire in{" "}
                  <strong>{verificationTokenExpMin} minutes</strong> for security reasons.
                </Text>

                <Section className="py-8 text-center">
                  <Button
                    className="rounded-md bg-green-600 px-8 py-3 text-center font-bold text-white hover:bg-green-700"
                    href={resetUrl}
                  >
                    Reset Your Password
                  </Button>
                </Section>

                {/* Alternative Link */}
                <Text className="mb-8 text-center text-gray-600 text-sm leading-6">
                  If the button doesn&apos;t work, copy and paste this link into your browser:
                  <br />
                  <Link href={resetUrl} className="break-all text-blue-600 underline">
                    {resetUrl}
                  </Link>
                </Text>

                {/* Security Notice */}
                <Section className="mb-8 rounded-md bg-yellow-100 p-5">
                  <Text className="mb-2 font-bold text-sm text-yellow-800 leading-5">
                    Security Notice:
                  </Text>
                  <Text className="m-0 text-sm text-yellow-800 leading-5">
                    If you didn&apos;t request a password reset, please ignore this email or contact
                    our support team immediately. Someone may be trying to access your account.
                  </Text>
                </Section>

                {/* Security Tips */}
                <Section>
                  <Text className="mb-3 font-bold text-gray-800 text-sm leading-5">
                    Security Tips:
                  </Text>
                  <ul style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "8px" }}>
                      <Text className="m-0 text-gray-600 text-sm leading-5">
                        Choose a strong, unique password
                      </Text>
                    </li>
                    <li style={{ marginBottom: "8px" }}>
                      <Text className="m-0 text-gray-600 text-sm leading-5">
                        Never share your password with anyone
                      </Text>
                    </li>
                    <li>
                      <Text className="m-0 text-gray-600 text-sm leading-5">
                        Enable two-factor authentication if available
                      </Text>
                    </li>
                  </ul>
                </Section>
              </Section>

              <Hr className="my-2 border-gray-200" />

              {/* Footer */}
              <Section className="rounded-b-lg bg-yellow-100 px-8 py-6">
                <Text className="mb-2 text-center text-sm text-yellow-800 leading-5">
                  Need help? Contact our support team
                </Text>
                <Text className="m-0 text-center text-xs text-yellow-800">
                  &copy; {currentYear} Navodhai Store. All rights reserved.
                </Text>
              </Section>
            </Section>

            {/* Additional Footer Note */}
            <Section className="mt-5 text-center">
              <Text className="m-0 text-xs text-yellow-800">
                This is an automated message, please do not reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
