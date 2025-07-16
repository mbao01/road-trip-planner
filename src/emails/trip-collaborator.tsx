import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { TripRole } from "@prisma/client";
import { Button, Column, Img, Link, Row, Section, Text } from "@react-email/components";
import EmailContainer from "./container";

interface TripCollaboratorEmailProps {
  baseUrl: string;
  invitedByName?: string | null;
  invitedByEmail?: string | null;
  invitedByImage?: string | null;
  inviteeName?: string | null;
  inviteeImage?: string | null;
  tripId: string;
  tripName: string;
  tripRole: TripRole;
}

export const TripCollaboratorEmail = ({
  baseUrl,
  invitedByName,
  invitedByEmail,
  invitedByImage,
  inviteeName,
  inviteeImage,
  tripId,
  tripName,
  tripRole,
}: TripCollaboratorEmailProps) => {
  const tripLink = `${baseUrl}/trips/${tripId}`;

  return (
    <EmailContainer
      baseUrl={baseUrl}
      preview={`${invitedByName} has added you as an ${TRIP_ROLE[tripRole]} on ${tripName}`}
      heading={
        <>
          Participate in the <strong className="text-foreground">{tripName}</strong> trip
        </>
      }
    >
      <Text className="text-[14px] text-black leading-[24px]">Fantastic,</Text>
      <Text className="text-[14px] text-black leading-[24px]">
        <strong className="text-foreground">{invitedByName}</strong> (
        <Link href={`mailto:${invitedByEmail}`} className="text-secondary no-underline">
          {invitedByEmail}
        </Link>
        ) has added you as an {TRIP_ROLE[tripRole]} in their{" "}
        <strong className="text-foreground">{tripName}</strong> trip.
      </Text>

      <Section>
        <Row>
          <Column align="right">
            <Img
              className="rounded-full"
              src={inviteeImage ?? `${baseUrl}/static/images/user.png`}
              width="64"
              height="64"
              alt={`${inviteeName} picture`}
            />
          </Column>
          <Column align="center">
            <Img
              src={`${baseUrl}/static/images/heart-handshake.png`}
              width="12"
              height="9"
              alt="Arrow indicating collaboration"
            />
          </Column>
          <Column align="left">
            <Img
              className="rounded-full"
              src={invitedByImage ?? `${baseUrl}/static/images/user.png`}
              width="64"
              height="64"
              alt={`${invitedByName} picture`}
            />
          </Column>
        </Row>
      </Section>

      <Section className="mt-[32px] mb-[32px] text-center">
        <Button
          className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
          href={tripLink}
        >
          View your trip
        </Button>
      </Section>

      <Text className="text-[14px] text-black leading-[24px]">
        Start off collaborating on you're new adventure. And always enjoy every moment!
      </Text>
    </EmailContainer>
  );
};

export default TripCollaboratorEmail;
