import { TripCollaboratorEmail } from "@/emails/trip-collaborator";
import { TripInviteEmail } from "@/emails/trip-invite";
import { TripRole } from "@prisma/client";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a trip invite email to the specified email address.
 */
export const sendTripInviteEmail = async (email: string, tripName: string, invitedBy: string) => {
  const emailHtml = render(<TripInviteEmail tripName={tripName} invitedBy={invitedBy} />);

  await resend.emails.send({
    from: "onboarding@resend.dev",
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
  tripName: string,
  addedBy: string,
  tripRole: TripRole
) => {
  const emailHtml = render(
    <TripCollaboratorEmail tripName={tripName} addedBy={addedBy} tripRole={tripRole} />
  );

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `You have been added to the trip: ${tripName}`,
    html: emailHtml,
  });
};
