import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nimble: {
      configured: Boolean(process.env.NIMBLE_API_KEY),
      mode: process.env.NIMBLE_API_KEY ? "real-api-ready" : "missing-key",
      required: ["NIMBLE_API_KEY"],
    },
    senso: {
      configured: Boolean(process.env.SENSO_API_KEY),
      mode: process.env.SENSO_API_KEY ? "real-api-ready" : "fallback",
      required: ["SENSO_API_KEY", "optional SENSO_SEARCH_URL"],
    },
    clickhouse: {
      configured: Boolean(
        process.env.CLICKHOUSE_URL &&
          process.env.CLICKHOUSE_USERNAME &&
          process.env.CLICKHOUSE_PASSWORD
      ),
      mode:
        process.env.CLICKHOUSE_URL &&
        process.env.CLICKHOUSE_USERNAME &&
        process.env.CLICKHOUSE_PASSWORD
          ? "real-api-ready"
          : "fallback",
      required: ["CLICKHOUSE_URL", "CLICKHOUSE_USERNAME", "CLICKHOUSE_PASSWORD"],
    },
    googleAgentCli: {
      configured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_PROJECT),
      mode: process.env.GEMINI_API_KEY
        ? "gemini-api-ready"
        : process.env.GOOGLE_CLOUD_PROJECT
          ? "google-cloud-ready"
          : "not-configured",
      required: ["GEMINI_API_KEY", "optional GOOGLE_CLOUD_PROJECT"],
    },
  });
}
