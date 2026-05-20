import { NextResponse } from "next/server";
import { simulateFinancing } from "@/lib/domain/financing";

export async function POST(request: Request) {
  return NextResponse.json(simulateFinancing(await request.json()));
}
