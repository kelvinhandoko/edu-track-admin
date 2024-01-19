import { api } from "@/trpc/server";
import { NextResponse, type NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await api.lecturer.find.query();
  if (!data) {
    return NextResponse.json({}, { status: 401 });
  }

  return NextResponse.json({}, { status: 200 });
}
