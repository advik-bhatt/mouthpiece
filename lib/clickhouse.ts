import { createClient } from "@clickhouse/client";

type EventToLog = {
  step: number;
  title: string;
  detail: string;
  source: string;
  risk: string;
  status: string;
};

type MetricsToLog = Record<string, number>;

const hasClickHouseEnv =
  Boolean(process.env.CLICKHOUSE_URL) &&
  Boolean(process.env.CLICKHOUSE_USERNAME) &&
  Boolean(process.env.CLICKHOUSE_PASSWORD);

const client = hasClickHouseEnv
  ? createClient({
      url: process.env.CLICKHOUSE_URL,
      username: process.env.CLICKHOUSE_USERNAME,
      password: process.env.CLICKHOUSE_PASSWORD,
      database: process.env.CLICKHOUSE_DATABASE || "default",
    })
  : null;

export async function ensureClickHouseTables() {
  if (!client) return { enabled: false, reason: "ClickHouse env vars not configured" };

  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS locallens_events (
        session_id String,
        step UInt32,
        title String,
        detail String,
        source String,
        risk String,
        status String,
        created_at DateTime64(3)
      )
      ENGINE = MergeTree
      ORDER BY (session_id, step)
    `,
  });

  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS locallens_metrics (
        session_id String,
        metric String,
        value Float64,
        created_at DateTime64(3)
      )
      ENGINE = MergeTree
      ORDER BY (session_id, metric)
    `,
  });

  return { enabled: true };
}

export async function logRecallFormRun(params: {
  sessionId: string;
  events: EventToLog[];
  metrics: MetricsToLog;
}) {
  if (!client) {
    return {
      enabled: false,
      message: "ClickHouse skipped. Add CLICKHOUSE_URL, CLICKHOUSE_USERNAME, CLICKHOUSE_PASSWORD to enable.",
    };
  }

  await ensureClickHouseTables();

  const now = new Date().toISOString();

  await client.insert({
    table: "locallens_events",
    values: params.events.map((event) => ({
      session_id: params.sessionId,
      step: event.step,
      title: event.title,
      detail: event.detail,
      source: event.source,
      risk: event.risk,
      status: event.status,
      created_at: now,
    })),
    format: "JSONEachRow",
  });

  await client.insert({
    table: "locallens_metrics",
    values: Object.entries(params.metrics).map(([metric, value]) => ({
      session_id: params.sessionId,
      metric,
      value,
      created_at: now,
    })),
    format: "JSONEachRow",
  });

  return {
    enabled: true,
    message: "ClickHouse audit ledger updated.",
  };
}
