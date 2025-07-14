import { NextResponse } from "next/server";
import { googleService } from "@/services/google";

export async function POST(request: Request) {
  const body = await request.json();
  const { origins, destinations } = body;

  if (!origins || !destinations) {
    return NextResponse.json(
      { error: "'origins' and 'destinations' properties are required" },
      { status: 400 }
    );
  }

  try {
    const { matrix } = await googleService.getRouteMatrix({ origins, destinations });

    return NextResponse.json(matrix);
  } catch (error) {
    console.error("Error fetching from routes API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
