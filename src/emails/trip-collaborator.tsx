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

interface TripCollaboratorEmailProps {
  addedBy: string;
  tripId: string;
  tripName: string;
  tripRole: TripRole;
  originUrl: string;
}

export const TripCollaboratorEmail = ({
  tripId,
  addedBy,
  tripName,
  tripRole,
  originUrl,
}: TripCollaboratorEmailProps) => (
  <Html>
    <Head />
    <Preview>You have been added to the trip: {tripName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You&apos;ve Been Added to a Trip!</Heading>
        <Text style={text}>
          <strong>{addedBy}</strong> has added you to the trip:
          <strong> {tripName}</strong> as a <strong>{TRIP_ROLE[tripRole]}</strong>.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={`${originUrl}/trips/${tripId}`}>
            View Trip
          </Button>
        </Section>
        <Text style={text}>You can now collaborate on the trip plan. Happy travels!</Text>
      </Container>
    </Body>
  </Html>
);

export default TripCollaboratorEmail;

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
