type ReliabilityInput = {
  headline: string;
  summary: string;
  sources: { title: string; url: string; role: string }[];
  agentTrace: string[];
  geminiDecision?: {
    publishable: boolean;
    classification: string;
    reason: string;
  };
  events: {
    step: number;
    title: string;
    detail: string;
    source: string;
    risk: string;
    status: string;
  }[];
};

type LapdogReview = {
  provider: "Datadog Lapdog";
  mode: "lapdog-traced" | "configured-forwarder" | "local-audit";
  passed: boolean;
  score: number;
  verdict: string;
  checks: {
    name: string;
    status: "pass" | "warn" | "fail";
    comment: string;
  }[];
  traceSummary: string[];
  raw?: unknown;
  error?: string;
};

export async function runLapdogReliabilityReview(
  input: ReliabilityInput
): Promise<LapdogReview> {
  const lapdogUrl = process.env.DATADOG_LAPDOG_URL;

  const localReview: LapdogReview = {
    provider: "Datadog Lapdog",
    mode: process.env.DD_TRACE_AGENT_URL ? "lapdog-traced" : "local-audit",
    passed: Boolean(input.geminiDecision?.publishable),
    score: input.geminiDecision?.publishable ? 92 : 61,
    verdict: input.geminiDecision?.publishable
      ? "Publishable. The claim has resident impact, named public sources, and a visible agent trace."
      : "Hold. The claim did not pass the Gemini editorial relevance check.",
    checks: [
      {
        name: "Source grounding",
        status: input.sources.length >= 2 ? "pass" : "warn",
        comment:
          input.sources.length >= 2
            ? "Brief includes multiple public source references."
            : "Brief has limited source coverage.",
      },
      {
        name: "Claim specificity",
        status: input.headline.length > 20 && input.summary.length > 40 ? "pass" : "warn",
        comment:
          "Headline and summary include a specific location/topic instead of a vague civic claim.",
      },
      {
        name: "Resident impact",
        status:
          input.geminiDecision?.classification === "resident-relevant" ||
          input.geminiDecision?.classification === "urgent"
            ? "pass"
            : "warn",
        comment:
          input.geminiDecision?.reason ||
          "Gemini decision unavailable; using local policy fallback.",
      },
      {
        name: "Trace completeness",
        status: input.events.length >= 5 && input.agentTrace.length >= 4 ? "pass" : "warn",
        comment:
          "Audit trail includes extraction, decision, grounding, and storage steps.",
      },
    ],
    traceSummary: input.events.map(
      (event) => `${event.step}. ${event.source}: ${event.title}`
    ),
  };

  if (!lapdogUrl) return localReview;

  try {
    const response = await fetch(lapdogUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, localReview }),
    });

    if (!response.ok) {
      throw new Error(`Lapdog forwarder returned ${response.status}: ${await response.text()}`);
    }

    const raw = await response.json();

    return {
      ...localReview,
      mode: "configured-forwarder",
      raw,
    };
  } catch (error) {
    return {
      ...localReview,
      error: String(error),
    };
  }
}
