import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface VerifyEmailProps {
  token: string;
  verificationTokenExpMin: number;
  baseUrl: string;
}

export const VerifyEmail = ({ token, verificationTokenExpMin, baseUrl }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Zealer Space - Verify Your Email</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto px-0 py-5">
            <Section className="mx-auto max-w-600 rounded-lg bg-white shadow-sm">
              {/* Header */}
              <Section className="rounded-t-lg bg-blue-500 px-8 py-10 text-center">
                <Heading className="m-0 text-2xl font-bold text-white">Zealer Space</Heading>
              </Section>

              {/* Content */}
              <Section className="px-8 py-10">
                <Text className="mb-5 text-base leading-6 text-gray-800">Hi there,</Text>
                <Text className="mb-5 text-base leading-6 text-gray-800">
                  Welcome to Zealer Space! We are excited to have you join our community. To get started, please verify
                  your email address by clicking the button below.
                </Text>
                <Text className="mb-8 text-base leading-6 text-gray-800">
                  This verification link will expire in <strong>{verificationTokenExpMin} minutes</strong>.
                </Text>

                <Button
                  className="w-full rounded-md bg-green-600 px-8 py-3 text-center font-bold text-white transition-colors hover:bg-green-700"
                  href={`${baseUrl}/auth/verify-email?token=${token}`}
                >
                  Verify Email Address
                </Button>

                <Section className="mt-8 rounded-md bg-gray-50 p-5">
                  <Text className="m-0 text-sm leading-5 text-gray-500">
                    If you did not create an account with Zealer Space, you can safely ignore this email.
                  </Text>
                </Section>
              </Section>

              <Hr className="my-8 border-gray-200" />

              {/* Footer */}
              <Section className="rounded-b-lg bg-gray-50 px-8 py-6">
                <Text className="mb-2 text-center text-sm leading-5 text-gray-500">
                  Need help? Contact our support team
                </Text>
                <Text className="m-0 text-center text-xs text-gray-400">
                  © {new Date().getFullYear()} Zealer Hub. All rights reserved.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
