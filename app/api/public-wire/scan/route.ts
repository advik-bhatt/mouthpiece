import { NextResponse } from "next/server";
import { runPublicWireScan } from "@/lib/public-wire-agent";
import { requireAdmin } from "@/lib/public-wire-request-guard";

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await runPublicWireScan();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to run PublicWire scan", detail: String(error) },
      { status: 500 }
    );
  }
}
