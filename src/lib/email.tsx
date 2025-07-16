import { TripCollaboratorEmail } from "@/emails/trip-collaborator";
import { TripInviteEmail } from "@/emails/trip-invite";
import { TripRole, User } from "@prisma/client";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a trip invite email to the specified email address.
 */
export const sendTripInviteEmail = async ({
  email,
  tripName,
  tripRole,
  invitedBy,
}: {
  email: string;
  tripName: string;
  tripRole: TripRole;
  invitedBy: User;
}) => {
  const emailHtml = await render(
    <TripInviteEmail
      baseUrl={process.env.APP_ORIGIN_URL!}
      invitedByEmail={invitedBy.email}
      invitedByImage={invitedBy.image}
      invitedByName={invitedBy.name?.split(" ")[0]}
      tripName={tripName}
      tripRole={tripRole}
    />
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `You have been invited to join a trip: ${tripName}`,
    html: emailHtml,
  });
};

/**
 * Sends a trip collaborator email to the specified email address.
 */
export const sendTripCollaboratorEmail = async ({
  email,
  tripId,
  tripName,
  tripRole,
  invitee,
  invitedBy,
}: {
  email: string;
  tripId: string;
  tripName: string;
  tripRole: TripRole;
  invitee: User;
  invitedBy: User;
}) => {
  const emailHtml = await render(
    <TripCollaboratorEmail
      baseUrl={process.env.APP_ORIGIN_URL!}
      invitedByEmail={invitedBy.email}
      invitedByImage={invitedBy.image}
      invitedByName={invitedBy.name?.split(" ")[0]}
      inviteeName={invitee.name?.split(" ")[0]}
      inviteeImage={invitee.image}
      tripId={tripId}
      tripName={tripName}
      tripRole={tripRole}
    />
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `You have been added to the trip: ${tripName}`,
    html: emailHtml,
  });
};
