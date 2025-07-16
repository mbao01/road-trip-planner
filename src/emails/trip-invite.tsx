import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { TripRole } from "@prisma/client";
import { Button, Column, Img, Link, Row, Section, Text } from "@react-email/components";
import EmailContainer from "./container";

interface TripInviteEmailProps {
  baseUrl: string;
  invitedByName?: string | null;
  invitedByEmail?: string | null;
  invitedByImage?: string | null;
  tripName: string;
  tripRole: TripRole;
}

export const TripInviteEmail = ({
  invitedByName,
  invitedByEmail,
  invitedByImage,
  tripName,
  tripRole,
  baseUrl,
}: TripInviteEmailProps) => {
  const acceptTripCallbackUrl = `${baseUrl}/trips/accept`;
  const inviteLink = `${baseUrl}/auth/signup?callbackUrl=${encodeURIComponent(acceptTripCallbackUrl)}`;

  return (
    <EmailContainer
      baseUrl={baseUrl}
      preview={`Join ${invitedByName} as an ${TRIP_ROLE[tripRole]} on ${tripName}`}
      heading={
        <>
          Join <strong className="text-foreground">{invitedByName}</strong> on{" "}
          <strong className="text-foreground">{tripName}</strong>
        </>
      }
    >
      <Text className="text-[14px] text-black leading-[24px]">Hello,</Text>
      <Text className="text-[14px] text-black leading-[24px]">
        <strong className="text-foreground">{invitedByName}</strong> (
        <Link href={`mailto:${invitedByEmail}`} className="text-secondary no-underline">
          {invitedByEmail}
        </Link>
        ) has invited you to join them on their{" "}
        <strong className="text-foreground">{tripName}</strong> trip.
      </Text>

      <Section>
        <Row>
          <Column align="right">
            <Img
              className="rounded-full"
              src={`${baseUrl}/static/images/user.png`}
              width="64"
              height="64"
              alt="Profile picture"
            />
          </Column>
          <Column align="center">
            <Img
              src={`${baseUrl}/static/images/arrow-right.png`}
              width="12"
              height="9"
              alt="Arrow indicating invitation"
            />
          </Column>
          <Column align="left">
            <Img
              className="rounded-full"
              src={invitedByImage ?? `${baseUrl}/static/images/user.png`}
              width="64"
              height="64"
              alt={`${invitedByName} logo`}
            />
          </Column>
        </Row>
      </Section>

      <Section className="mt-[32px] mb-[32px] text-center">
        <Button
          className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
          href={inviteLink}
        >
          Accept invite
        </Button>
      </Section>

      <Text className="text-[14px] text-black leading-[24px]">
        or copy and paste this URL into your browser:{" "}
        <Link href={inviteLink} className="text-secondary no-underline">
          {inviteLink}
        </Link>
      </Text>

      <Text className="text-[14px] text-black leading-[24px]">
        Start off collaborating on you're new adventure. Enjoy every moment!
      </Text>
    </EmailContainer>
  );
};

export default TripInviteEmail;
