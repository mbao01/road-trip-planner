import { NextRequest, NextResponse } from "next/server";
import { collaboratorService } from "@/services/collaborator";

/**
 * GET /api/trips/[tripId]/collaborators
 * @returns Collaborators
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

  try {
    const { collaborators } = await collaboratorService.getCollaborators({ tripId });

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

  try {
    const body = await req.json();

    const { collaborator } = await collaboratorService.addCollaborator({ tripId }, body);
    return NextResponse.json({ ...collaborator });
  } catch (error) {
    console.error(`Failed to add/invite collaborator:`, error);
    return NextResponse.json({ error: "Failed to add/invite collaborator" }, { status: 500 });
  }
};
