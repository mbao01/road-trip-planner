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
}

export const TripInviteEmail = ({ invitedBy, tripName }: TripInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>You have been invited to join {tripName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're Invited!</Heading>
        <Text style={text}>
          <strong>{invitedBy}</strong> has invited you to join the trip:
          <strong> {tripName}</strong>.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href="https://road-trip-planner.com/dashboard">
            View Trip
          </Button>
          <Button style={buttonSecondary} href="https://road-trip-planner.com/register">
            Create Account
          </Button>
        </Section>
        <Text style={text}>
          We're excited to have you on board. Plan, collaborate, and make memories that will last a
          lifetime.
        </Text>
      </Container>
    </Body>
  </Html>
);

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
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: "var(--radius)",
  marginRight: "8px",
};

const buttonSecondary = {
  ...button,
  backgroundColor: "hsl(var(--secondary))",
  color: "hsl(var(--secondary-foreground))",
  marginRight: "0",
};
