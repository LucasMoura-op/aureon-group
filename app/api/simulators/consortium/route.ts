import { NextResponse } from "next/server";
import { simulateConsortium } from "@/lib/domain/consortium";

export async function POST(request: Request) {
  return NextResponse.json(simulateConsortium(await request.json()));
}
