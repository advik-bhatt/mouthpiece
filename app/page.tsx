"use client";

import { useState } from "react";

type LocalSource = {
  id: string;
  name: string;
  url: string;
  category: string;
  sourceType: string;
};

type LocalChange = {
  id: string;
  sourceId: string;
  title: string;
  category: string;
  status: string;
  importance: string;
  whatChanged: string;
  whyItMatters: string;
  whoIsAffected: string[];
  evidence: string[];
  rejectionReason?: string;
};

type CivicBrief = {
  id: string;
  headline: string;
  area: string;
  category: string;
  confidence: string;
  status: string;
  summary: string;
  whyItMatters: string;
  whoIsAffected: string[];
  sources: {
    title: string;
    url: string;
    role: string;
  }[];
  agentTrace: string[];
};

type AgentEvent = {
  step: number;
  title: string;
  detail: string;
  source: string;
  risk: string;
  status: string;
};

type ScanResult = {
  sessionId: string;
  area: string;
  lastChecked: string;
  sources: LocalSource[];
  changes: LocalChange[];
  published: LocalChange[];
  rejected: LocalChange[];
  brief: CivicBrief;
  events: AgentEvent[];
  metrics: Record<string, number>;
  clickhouse: {
    enabled: boolean;
    message?: string;
    reason?: string;
  };
  publishing?: {
    provider: string;
    mode: string;
    purpose: string;
    publishedUrl?: string;
    citationId?: string;
    error?: string;
  };
  googleEditorial?: {
    provider: string;
    mode: string;
    purpose: string;
    decision: {
      publishable: boolean;
      classification: string;
      reason: string;
    };
    error?: string;
  };
  lapdogReview?: {
    provider: string;
    mode: string;
    passed: boolean;
    score: number;
    verdict: string;
    checks: {
      name: string;
      status: string;
      comment: string;
    }[];
    traceSummary: string[];
    error?: string;
  };
  sponsorStack: Record<string, { provider: string; role: string }>;
};

function badgeClass(value: string) {
  if (value === "resident-relevant" || value === "high" || value === "published") {
    return "border-emerald-200 bg-emerald-100 text-emerald-800";
  }
  if (value === "routine" || value === "rejected") {
    return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
  if (value === "medium" || value === "new") {
    return "border-blue-200 bg-blue-100 text-blue-800";
  }
  return "border-black/10 bg-white text-black/60";
}

function readableKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export default function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    setLoading(true);
    const res = await fetch("/api/local-lens/scan", { method: "POST" });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#1d1b18]">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
        <header className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-[#f4f1ea] px-3 py-1 text-sm font-semibold">
              LocalLens
            </span>
            <span className="rounded-full border border-black/10 bg-[#f4f1ea] px-3 py-1 text-sm font-semibold">
              Autonomous civic change monitor
            </span>
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl">
            Your neighborhood, monitored by agents.
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-black/65">
            LocalLens watches public city pages, meeting agendas, transit alerts,
            construction notices, school updates, permits, and event calendars, then
            publishes short cited briefs when something meaningful changes.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
              <div className="text-sm font-semibold">Nimble</div>
              <p className="mt-1 text-sm text-black/60">
                Discovers and extracts structured facts from messy civic web sources.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
              <div className="text-sm font-semibold">ClickHouse</div>
              <p className="mt-1 text-sm text-black/60">
                Stores source snapshots, diffs, decisions, and source health over time.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
              <div className="text-sm font-semibold">Senso / cited.md</div>
              <p className="mt-1 text-sm text-black/60">
                Turns verified findings into grounded public civic briefs.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 rounded-2xl border border-black/10 bg-[#fbfaf7] px-5 py-4 text-black/60">
              New Brunswick, NJ
            </div>
            <button
              onClick={runScan}
              disabled={loading}
              className="rounded-2xl bg-black px-6 py-4 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Scanning civic sources..." : "Run LocalLens scan"}
            </button>
          </div>
        </header>

        {result && (
          <>
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">{result.area}</h2>
                <p className="mt-2 text-sm text-black/60">
                  Civic briefing generated {result.lastChecked}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {Object.entries(result.metrics).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                      <div className="text-3xl font-semibold">{value}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-black/45">
                        {readableKey(key)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                  <div className="text-sm font-semibold">ClickHouse ledger</div>
                  <p className="mt-2 text-sm text-black/60">
                    {result.clickhouse.enabled
                      ? result.clickhouse.message
                      : result.clickhouse.message || result.clickhouse.reason}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Today’s briefing</h2>
                <p className="mt-2 text-sm text-black/60">
                  Meaningful updates detected across public sources.
                </p>

                <div className="mt-5 space-y-4">
                  {result.published.map((change) => (
                    <article key={change.id} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-2 py-1 text-xs ${badgeClass(change.importance)}`}>
                          {change.importance}
                        </span>
                        <span className={`rounded-full border px-2 py-1 text-xs ${badgeClass(change.status)}`}>
                          {change.status}
                        </span>
                        <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs">
                          {change.category}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold">{change.title}</h3>
                      <p className="mt-2 text-sm text-black/65">
                        <strong>What changed:</strong> {change.whatChanged}
                      </p>
                      <p className="mt-2 text-sm text-black/65">
                        <strong>Why it matters:</strong> {change.whyItMatters}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Published civic brief</h2>
              <p className="mt-2 text-sm text-black/60">
                This is the public artifact LocalLens creates.
              </p>

              <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                    {result.brief.confidence} confidence
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {result.brief.status}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs">
                    {result.brief.category}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-semibold">{result.brief.headline}</h3>
                <p className="mt-4 text-black/70">{result.brief.summary}</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <h4 className="font-semibold">Why it matters</h4>
                    <p className="mt-2 text-sm text-black/60">{result.brief.whyItMatters}</p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <h4 className="font-semibold">Who may be affected</h4>
                    <p className="mt-2 text-sm text-black/60">
                      {result.brief.whoIsAffected.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="font-semibold">Sources</h4>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {result.brief.sources.map((source) => (
                      <div key={source.title} className="rounded-2xl border border-black/10 bg-white p-4">
                        <div className="font-semibold">{source.title}</div>
                        <p className="mt-2 text-sm text-black/60">{source.role}</p>
                        <p className="mt-2 truncate text-xs text-black/40">{source.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Agent console</h2>
                <p className="mt-2 text-sm text-black/60">
                  What the autonomous civic desk checked, detected, rejected, and published.
                </p>

                <div className="mt-5 space-y-4">
                  {result.events.map((event) => (
                    <div key={event.step} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                          {event.step}
                        </span>
                        <h3 className="font-semibold">{event.title}</h3>
                        <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs">
                          {event.source}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-black/65">{event.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold">Rejected items</h2>
                  <div className="mt-5 space-y-3">
                    {result.rejected.map((change) => (
                      <div key={change.id} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                        <div className="font-semibold">{change.title}</div>
                        <p className="mt-2 text-sm text-black/60">
                          {change.rejectionReason}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold">Sources monitored</h2>
                  <div className="mt-5 space-y-3">
                    {result.sources.map((source) => (
                      <div key={source.id} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                        <div className="font-semibold">{source.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-wide text-black/40">
                          {source.category} · {source.sourceType}
                        </div>
                        <p className="mt-2 truncate text-xs text-black/40">{source.url}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            {result.lapdogReview && (
              <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Reliability report</h2>
                <p className="mt-2 text-sm text-black/60">
                  Datadog Lapdog trace audit of the agent chain before publishing.
                </p>

                <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold">
                      {result.lapdogReview.provider}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
                      {result.lapdogReview.mode}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                      Score {result.lapdogReview.score}
                    </span>
                    <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-800">
                      {result.lapdogReview.passed ? "Passed" : "Held"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-black/70">
                    <strong>Verdict:</strong> {result.lapdogReview.verdict}
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {result.lapdogReview.checks.map((check) => (
                      <div key={check.name} className="rounded-2xl border border-black/10 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold">{check.name}</div>
                          <span className="rounded-full border border-black/10 bg-[#f4f1ea] px-2 py-1 text-xs uppercase">
                            {check.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-black/60">{check.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
                    <h3 className="font-semibold">Trace comments</h3>
                    <ol className="mt-3 space-y-2 text-sm text-black/60">
                      {result.lapdogReview.traceSummary.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
            )}

            {result.googleEditorial && (
              <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Gemini editorial decision</h2>
                <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                  <div className="font-semibold">{result.googleEditorial.provider}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-black/40">
                    {result.googleEditorial.mode}
                  </div>
                  <p className="mt-2 text-sm text-black/60">{result.googleEditorial.purpose}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-black/40">Publishable</div>
                      <div className="mt-1 text-lg font-semibold">
                        {result.googleEditorial.decision.publishable ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-black/40">Classification</div>
                      <div className="mt-1 text-lg font-semibold">
                        {result.googleEditorial.decision.classification}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-black/40">Model</div>
                      <div className="mt-1 text-lg font-semibold">Gemini</div>
                    </div>
                  </div>
                  <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-black/65">
                    <strong>Reason:</strong> {result.googleEditorial.decision.reason}
                  </p>
                </div>
              </section>
            )}

            {result.publishing && (
              <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Senso publish status</h2>
                <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                  <div className="font-semibold">{result.publishing.provider}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-black/40">
                    {result.publishing.mode}
                  </div>
                  <p className="mt-2 text-sm text-black/60">{result.publishing.purpose}</p>
                  {result.publishing.citationId && (
                    <p className="mt-2 text-sm text-black/60">
                      <strong>Citation ID:</strong> {result.publishing.citationId}
                    </p>
                  )}
                  {result.publishing.publishedUrl && (
                    <p className="mt-2 text-sm text-black/60">
                      <strong>Published URL:</strong>{" "}
                      <a
                        href={result.publishing.publishedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-black/30 underline-offset-4"
                      >
                        {result.publishing.publishedUrl}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            )}

            <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Sponsor stack proof</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {Object.values(result.sponsorStack).map((sponsor) => (
                  <div key={sponsor.provider} className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                    <div className="font-semibold">{sponsor.provider}</div>
                    <p className="mt-2 text-sm text-black/60">{sponsor.role}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
