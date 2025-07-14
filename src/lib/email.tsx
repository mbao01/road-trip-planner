import { TripCollaboratorEmail } from "@/emails/trip-collaborator";
import { TripInviteEmail } from "@/emails/trip-invite";
import { TripRole } from "@prisma/client";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a trip invite email to the specified email address.
 */
export const sendTripInviteEmail = async (
  email: string,
  tripName: string,
  invitedBy: string,
  tripRole: TripRole
) => {
  const emailHtml = await render(
    <TripInviteEmail
      tripName={tripName}
      invitedBy={invitedBy}
      tripRole={tripRole}
      originUrl={process.env.APP_ORIGIN_URL!}
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
export const sendTripCollaboratorEmail = async (
  email: string,
  tripId: string,
  tripName: string,
  addedBy: string,
  tripRole: TripRole
) => {
  const emailHtml = await render(
    <TripCollaboratorEmail
      tripId={tripId}
      tripName={tripName}
      addedBy={addedBy}
      tripRole={tripRole}
      originUrl={process.env.APP_ORIGIN_URL!}
    />
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `You have been added to the trip: ${tripName}`,
    html: emailHtml,
  });
};
