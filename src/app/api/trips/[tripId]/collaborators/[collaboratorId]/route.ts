import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { updateCollaboratorSchema } from "@/app/api/utilities/validation/schemas/collaborator";
import { collaboratorRepo } from "@/repository/collaborator";
import { TripRole } from "@prisma/client";

/**
 * GET /api/trips/[tripId]/collaborators/[collaboratorId]
 * @returns The requested collaborator
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; collaboratorId: string }> }
) {
  const { tripId, collaboratorId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const collaborator = await collaboratorRepo.getCollaborator(collaboratorId);

    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json(collaborator);
  } catch (error) {
    console.error(`Failed to retrieve collaborator ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve collaborator" }, { status: 500 });
  }
};

/**
 * PUT /api/trips/[tripId]/collaborators/[collaboratorId]
 * @returns The updated collaborator
 */
export const PUT = async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; collaboratorId: string }> }
) {
  const { tripId, collaboratorId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  try {
    const body = await req.json();
    const result = validator(body, updateCollaboratorSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const collaborator = await collaboratorRepo.updateCollaborator(
      tripId,
      collaboratorId,
      result.data
    );
    return NextResponse.json(collaborator);
  } catch (error) {
    console.error(`Failed to update collaborator ${collaboratorId}:`, error);
    return NextResponse.json({ error: "Failed to update collaborator" }, { status: 500 });
  }
};

/**
 * DELETE /api/trips/[tripId]/collaborators/[collaboratorId]
 * @returns The deleted collaborator
 */
export const DELETE = async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; collaboratorId: string }> }
) {
  const { tripId, collaboratorId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  try {
    await collaboratorRepo.removeCollaborator(tripId, collaboratorId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete collaborator ${collaboratorId}:`, error);
    return NextResponse.json({ error: "Failed to delete collaborator" }, { status: 500 });
  }
};
