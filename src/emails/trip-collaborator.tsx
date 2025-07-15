import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { TripRole } from "@prisma/client";
import { Button, Section, Text } from "@react-email/components";
import EmailContainer, { emailStyles } from "./container";

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
  <EmailContainer
    preview={`You have been added to the trip: ${tripName}`}
    heading={<>You&apos;ve Been Added to a Trip!</>}
    footer="You can now collaborate on the trip plan. Happy travels!"
  >
    <>
      <Text style={emailStyles.text}>
        <strong>{addedBy}</strong> has added you to the trip:
        <strong> {tripName}</strong> as a <strong>{TRIP_ROLE[tripRole]}</strong>.
      </Text>
      <Section style={emailStyles.buttonContainer}>
        <Button style={emailStyles.button} href={`${originUrl}/trips/${tripId}`}>
          View Trip
        </Button>
      </Section>
    </>
  </EmailContainer>
);

export default TripCollaboratorEmail;
