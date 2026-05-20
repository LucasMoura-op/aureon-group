import { NextResponse } from "next/server";
import { diagnoseProject, buildScenarios } from "@/lib/domain/diagnostics";

export async function POST(request: Request) {
  const body = await request.json();
  const diagnostic = diagnoseProject(body);
  const scenarios = buildScenarios(body);

  return NextResponse.json({
    diagnostic,
    scenarios,
    audit: {
      action: "PROJECT_DIAGNOSED",
      createdAt: new Date().toISOString()
    }
  });
}
