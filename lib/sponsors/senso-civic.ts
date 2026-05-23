import type { CivicBrief } from "@/lib/local-lens-data";

type SensoPublishResult = {
  provider: "Senso";
  mode: "real-api" | "seeded-demo" | "api-error-fallback";
  purpose: string;
  publishedUrl?: string;
  citationId?: string;
  raw?: unknown;
  error?: string;
};

function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function publishCivicBrief(params: {
  brief: CivicBrief;
}): Promise<SensoPublishResult> {
  const briefUrl = `${getAppBaseUrl()}/briefs/${params.brief.id}`;
  const apiKey = process.env.SENSO_API_KEY;
  const searchUrl =
    process.env.SENSO_SEARCH_URL || "https://apiv2.senso.ai/api/v1/org/search";

  if (!apiKey) {
    return {
      provider: "Senso",
      mode: "seeded-demo",
      purpose:
        "Senso API key missing. Add SENSO_API_KEY to use Senso as the grounded civic context layer.",
      publishedUrl: briefUrl,
      citationId: `seeded_${params.brief.id}`,
    };
  }

  try {
    const query = [
      "Verify and ground this LocalLens civic micro-brief using organization knowledge/context.",
      `Headline: ${params.brief.headline}`,
      `Area: ${params.brief.area}`,
      `Summary: ${params.brief.summary}`,
      `Why it matters: ${params.brief.whyItMatters}`,
      `Who is affected: ${params.brief.whoIsAffected.join(", ")}`,
      `Sources: ${params.brief.sources.map((s) => `${s.title} - ${s.url}`).join("; ")}`,
      `Agent trace: ${params.brief.agentTrace.join("; ")}`,
    ].join("\n");

    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Senso search returned ${response.status}: ${await response.text()}`);
    }

    const raw = await response.json();

    return {
      provider: "Senso",
      mode: "real-api",
      purpose:
        "Real Senso API call completed. Senso searched the LocalLens org context to ground the civic brief.",
      publishedUrl: briefUrl,
      citationId: `senso_${params.brief.id}`,
      raw,
    };
  } catch (error) {
    return {
      provider: "Senso",
      mode: "api-error-fallback",
      purpose:
        "Senso API call failed, so LocalLens kept the local cited brief artifact for demo continuity.",
      publishedUrl: briefUrl,
      citationId: `fallback_${params.brief.id}`,
      error: String(error),
    };
  }
}
