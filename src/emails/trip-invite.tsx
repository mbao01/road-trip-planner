import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { TripRole } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TripInviteEmailProps {
  invitedBy: string;
  tripName: string;
  tripRole: TripRole;
  originUrl: string;
}

export const TripInviteEmail = ({
  invitedBy,
  tripName,
  tripRole,
  originUrl,
}: TripInviteEmailProps) => {
  const callbackUrl = `${originUrl}/trips/accept`;

  return (
    <Html>
      <Head />
      <Preview>You have been invited to join {tripName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re Invited!</Heading>
          <Text style={text}>
            <strong>{invitedBy}</strong> has invited you to join the trip:
            <strong> {tripName}</strong> as a <strong>{TRIP_ROLE[tripRole]}</strong>.
          </Text>
          <Text style={text}>
            To view the trip details and start collaborating, you'll need to create an account
            first.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${originUrl}/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            >
              Create Account
            </Button>
          </Section>
          <Text style={text}>
            We&apos;re excited to have you on board. Plan, collaborate, and make memories that will
            last a lifetime.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TripInviteEmail;

const main = {
  backgroundColor: "hsl(var(--background))",
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const h1 = {
  color: "hsl(var(--primary))",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "hsl(var(--foreground))",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "hsl(var(--primary))",
  color: "hsl(var(--primary-foreground))",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  borderRadius: "var(--radius)",
};
