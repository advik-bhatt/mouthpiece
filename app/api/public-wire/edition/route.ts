import { NextResponse } from "next/server";
import { runPublicWireScan } from "@/lib/public-wire-agent";
import { toPublicWireEdition } from "@/lib/public-wire-edition-adapter";
import { cleanFocus, cleanInput, rateLimit } from "@/lib/public-wire-request-guard";

export async function POST(request: Request) {
  const limited = rateLimit(request, "public-wire-edition", 12);
  if (limited) return limited;

  try {
    const body = await request.json().catch(() => ({}));
    const area = cleanInput(body.area || "New Brunswick, NJ", 120) || "New Brunswick, NJ";
    const slug = cleanInput(body.slug || "new-brunswick", 120) || "new-brunswick";
    const focus = cleanFocus(body.focus);
    const requestedTopic = body.requestedTopic
      ? cleanInput(body.requestedTopic, 240)
      : undefined;

    const scan = await runPublicWireScan({ area, slug, focus, requestedTopic });
    const edition = toPublicWireEdition(scan, slug);

    return NextResponse.json({ edition, scan });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate PublicWire edition", detail: String(error) },
      { status: 500 }
    );
  }
}
