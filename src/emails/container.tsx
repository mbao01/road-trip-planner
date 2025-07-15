import { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ContainerProps {
  baseUrl: string;
  preview?: string;
  heading?: ReactNode;
  children: ReactNode;
}

export const EmailContainer = ({ baseUrl, preview, heading, children }: ContainerProps) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              background: "#fcfbf8",
              foreground: "#1c1b17",
              primary: "#f97415",
              secondary: "#4b1800",
            },
          },
        },
      }}
    >
      <Body className="mx-auto my-auto bg-white px-2 font-sans">
        {preview ? <Preview>{preview}</Preview> : null}
        <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
          <Section className="mt-[32px]">
            <Img
              src={`${baseUrl}/static/images/rtp.png`}
              width="40"
              height="37"
              alt="RTP Logo"
              className="mx-auto my-0"
            />
          </Section>
          {heading ? (
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              {heading}
            </Heading>
          ) : null}
          {children}

          <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
          <Text className="text-[#666666] text-[12px] leading-[24px]">
            This invitation was intended for the addressed email. If you were not expecting this
            invitation, you can ignore this email. If you are concerned about your account's safety,
            please reply to this email to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailContainer;
