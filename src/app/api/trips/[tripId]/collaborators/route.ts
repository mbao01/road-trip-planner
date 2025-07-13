import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { addCollaboratorSchema } from "@/app/api/utilities/validation/schemas/collaborator";
import { addCollaborator, getCollaborators } from "@/services/collaborator";
import { TripRole } from "@prisma/client";

/**
 * GET /api/trips/[tripId]/collaborators
 * @returns Collaborators
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const collaborators = await getCollaborators(tripId);

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error(`Failed to retrieve collaborators ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve collaborators" }, { status: 500 });
  }
};

/**
 * POST /api/trips/[tripId]/collaborators
 * @returns The added/invited collaborator
 */
export const POST = async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  try {
    const body = await req.json();
    const result = validator(body, addCollaboratorSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const collaborator = await addCollaborator(tripId, result.data);
    return NextResponse.json(collaborator);
  } catch (error) {
    console.error(`Failed to add/invite collaborator:`, error);
    return NextResponse.json({ error: "Failed to add/invite collaborator" }, { status: 500 });
  }
};
