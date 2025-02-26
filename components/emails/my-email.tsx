import { Button, Container, Head, Html, Section, Text } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Container className="bg-white p-16">
        <Section className="bg-white p-16">
          <Text className="m-0 text-xl">Hi there,</Text>
          <Text className="m-0 text-xl">
            Thanks for signing up! To activate your account, please click the following link:
          </Text>
          <Button className="bg-primary m-0 mt-8 block rounded px-6 py-3 text-center font-bold text-white" href={url}>
            Verify your email
          </Button>
          <Text className="m-0 mt-8 text-xl">Best, your friends at Zealer Space</Text>
        </Section>
      </Container>
    </Html>
  );
}
