import { NextRequest, NextResponse } from "next/server";
import { collaboratorService } from "@/services/collaborator";

/**
 * GET /api/trips/[tripId]/collaborators/[collaboratorId]
 * @returns The requested collaborator
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; collaboratorId: string }> }
) {
  const { tripId, collaboratorId } = await params;

  try {
    const { collaborator } = await collaboratorService.getCollaborator({ collaboratorId, tripId });

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

  try {
    const body = await req.json();

    const { collaborator } = await collaboratorService.updateCollaborator(
      { collaboratorId, tripId },
      body
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

  try {
    await collaboratorService.removeCollaborator({ collaboratorId, tripId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete collaborator ${collaboratorId}:`, error);
    return NextResponse.json({ error: "Failed to delete collaborator" }, { status: 500 });
  }
};
