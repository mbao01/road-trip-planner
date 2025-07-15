import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { TripRole } from "@prisma/client";
import { Button, Section, Text } from "@react-email/components";
import EmailContainer, { emailStyles } from "./container";

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
    <EmailContainer
      preview={`You have been invited to join ${tripName}`}
      heading={<>You&apos;re Invited!</>}
      footer={
        <>
          We&apos;re excited to have you on board. Plan, collaborate, and make memories that will
          last a lifetime.
        </>
      }
    >
      <Text style={emailStyles.text}>
        <strong>{invitedBy}</strong> has invited you to join the trip:
        <strong> {tripName}</strong> as a <strong>{TRIP_ROLE[tripRole]}</strong>.
      </Text>
      <Text style={emailStyles.text}>
        To view the trip details and start collaborating, you&apos;ll need to create an account
        first.
      </Text>
      <Section style={emailStyles.buttonContainer}>
        <Button
          style={emailStyles.button}
          href={`${originUrl}/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Create Account
        </Button>
      </Section>
    </EmailContainer>
  );
};

export default TripInviteEmail;
