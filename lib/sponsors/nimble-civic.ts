import Nimble from "@nimble-way/nimble-js";
import type { LocalChange, LocalSource } from "@/lib/local-lens-data";

type NimbleCivicResult = {
  provider: "Nimble";
  mode: "real-api" | "seeded-demo" | "api-error-fallback";
  purpose: string;
  sources: LocalSource[];
  changes: LocalChange[];
  raw?: unknown;
  error?: string;
};

function textFromResult(raw: unknown) {
  try {
    return JSON.stringify(raw, null, 2).slice(0, 5000);
  } catch {
    return String(raw).slice(0, 5000);
  }
}

function buildChangesFromSearch(raw: unknown, fallbackChanges: LocalChange[]): LocalChange[] {
  const rawText = textFromResult(raw);
  const nimbleEvidence = `Nimble live civic web search returned ${rawText.length} characters of source-discovery evidence.`;

  return fallbackChanges.map((change) => ({
    ...change,
    evidence: [nimbleEvidence, ...change.evidence],
  }));
}

function buildSourcesFromSearch(raw: unknown, fallbackSources: LocalSource[]): LocalSource[] {
  const rawText = textFromResult(raw);

  const liveSource: LocalSource = {
    id: "nimble_live_search",
    name: `Nimble live civic web search (${rawText.length} chars extracted)`,
    url: "Nimble Search API result",
    category: "city",
    sourceType: "public",
  };

  return [liveSource, ...fallbackSources.slice(0, 3)];
}

export async function nimbleRunCivicScan(params: {
  area: string;
  fallbackSources: LocalSource[];
  fallbackChanges: LocalChange[];
}): Promise<NimbleCivicResult> {
  const apiKey = process.env.NIMBLE_API_KEY;

  if (!apiKey) {
    return {
      provider: "Nimble",
      mode: "seeded-demo",
      purpose:
        "Nimble API key missing. Using seeded civic data until NIMBLE_API_KEY is added.",
      sources: params.fallbackSources,
      changes: params.fallbackChanges,
    };
  }

  try {
    const nimble = new Nimble({ apiKey });

    const result = await nimble.search({
      query:
        `For ${params.area}, find official or public civic sources and recent resident-relevant updates. ` +
        "Prioritize city notices, construction, road closures, public works, NJ Transit alerts, parking authority updates, Rutgers events, permits, and city council agendas. " +
        "Exclude rumors, private-person claims, unsupported crime claims, and opinion.",
      focus: "general",
      search_depth: "lite",
    });

    return {
      provider: "Nimble",
      mode: "real-api",
      purpose:
        "Real Nimble Search API call for live civic source discovery and resident-relevant update extraction.",
      sources: buildSourcesFromSearch(result, params.fallbackSources),
      changes: buildChangesFromSearch(result, params.fallbackChanges),
      raw: result,
    };
  } catch (error) {
    return {
      provider: "Nimble",
      mode: "api-error-fallback",
      purpose:
        "Nimble Search API call failed, so LocalLens fell back to seeded civic source data for demo continuity.",
      sources: params.fallbackSources,
      changes: params.fallbackChanges,
      error: String(error),
    };
  }
}
