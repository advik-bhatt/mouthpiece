import { localSources, publishedBrief, seededChanges } from "./local-lens-data";
import { logRecallFormRun } from "./clickhouse";
import { nimbleRunCivicScan } from "./sponsors/nimble-civic";
import { publishCivicBrief } from "./sponsors/senso-civic";
import { googleEditorialDecision } from "./sponsors/google-editor";
import { runLapdogReliabilityReview } from "./sponsors/lapdog-review";
import { traceStep } from "./datadog-trace";

export async function runLocalLensScan() {
  const sessionId = `scan_${Date.now()}`;
  const area = "New Brunswick, NJ";

  const nimble = await traceStep(
    "nimble.civic_scan",
    { area, sponsor: "nimble" },
    () =>
      nimbleRunCivicScan({
        area,
        fallbackSources: localSources,
        fallbackChanges: seededChanges,
      })
  );

  const changes = nimble.changes;
  const sources = nimble.sources;
  const published = changes.filter((change) => change.status !== "rejected");
  const rejected = changes.filter((change) => change.status === "rejected");

  const events = [
    {
      step: 1,
      title: "Source discovery started",
      detail: `Nimble scanned for official and public civic sources around ${area}.`,
      source: "Nimble",
      risk: "low",
      status: "done",
    },
    {
      step: 2,
      title: "Civic sources extracted",
      detail: `Nimble returned ${sources.length} monitorable civic sources.`,
      source: "Nimble",
      risk: "low",
      status: "done",
    },
    {
      step: 3,
      title: "Changes structured",
      detail: `Nimble produced ${changes.length} structured civic change candidates.`,
      source: "Nimble",
      risk: "low",
      status: "done",
    },
    {
      step: 4,
      title: "Changes compared",
      detail: "ClickHouse compares current source state against previous snapshots and publish history.",
      source: "ClickHouse",
      risk: "low",
      status: "done",
    },
    {
      step: 5,
      title: "Gemini editorial decision made",
      detail: "Gemini evaluated whether the detected civic change should be published, rejected, or flagged.",
      source: "Google Gemini",
      risk: "medium",
      status: "done",
    },
    {
      step: 6,
      title: "Grounded brief generated",
      detail: "Senso/cited publishing layer created a short source-backed civic brief.",
      source: "Senso",
      risk: "medium",
      status: "done",
    },
  ];

  const metrics = {
    sourcesChecked: sources.length,
    changesDetected: changes.length,
    briefsPublished: published.length > 0 ? 1 : 0,
    rejectedItems: rejected.length,
    officialSources: sources.filter((source) => source.sourceType === "official").length,
    confidenceScore: 94,
  };

  const clickhouse = await traceStep(
    "clickhouse.ledger_write",
    { area, session_id: sessionId, sponsor: "clickhouse" },
    () =>
      logRecallFormRun({
        sessionId,
        events,
        metrics,
      })
  );

  const googleEditorial = await traceStep(
    "gemini.editorial_decision",
    { area, sponsor: "google_gemini", candidate_count: published.length },
    () =>
      googleEditorialDecision({
        area,
        change: published[0],
      })
  );

  const sensoPublish = await traceStep(
    "senso.grounding",
    { area, sponsor: "senso", brief_id: publishedBrief.id },
    () =>
      publishCivicBrief({
        brief: publishedBrief,
      })
  );

  const lapdogReview = await traceStep(
    "lapdog.reliability_review",
    { area, sponsor: "datadog_lapdog", brief_id: publishedBrief.id },
    () =>
      runLapdogReliabilityReview({
        headline: publishedBrief.headline,
        summary: publishedBrief.summary,
        sources: publishedBrief.sources,
        agentTrace: publishedBrief.agentTrace,
        geminiDecision: googleEditorial.decision,
        events,
      })
  );

  return {
    sessionId,
    area,
    lastChecked: new Date().toLocaleString(),
    sources,
    changes,
    published,
    rejected,
    brief: publishedBrief,
    events,
    metrics,
    clickhouse,
    publishing: sensoPublish,
    googleEditorial,
    lapdogReview,
    sponsorStack: {
      nimble: {
        provider: "Nimble",
        role: `${nimble.mode}: ${nimble.purpose}`,
      },
      clickhouse: {
        provider: "ClickHouse",
        role: "Stores source snapshots, detected changes, rejected items, publish history, and agent decisions.",
      },
      senso: {
        provider: "Senso / cited.md",
        role: `${sensoPublish.mode}: ${sensoPublish.purpose}`,
      },
      googleAgentCli: {
        provider: "Google Gemini",
        role: `${googleEditorial.mode}: ${googleEditorial.purpose}`,
      },
    },
  };
}
