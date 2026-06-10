import { NextResponse } from "next/server";

type CoverageRecord = {
  area: string;
  slug: string;
  topic: string;
  sourceHint?: string;
  normalizedTopic: string;
  count: number;
  score: number;
  thresholdMet: boolean;
  createdAt: string;
  updatedAt: string;
};

const coverageRequests = new Map<string, CoverageRecord>();

function normalizeTopic(topic: string) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keyFor(area: string, topic: string) {
  return `${area.toLowerCase()}::${normalizeTopic(topic)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const area = String(body.area || "New Brunswick, NJ");
    const slug = String(body.slug || "new-brunswick");
    const topic = String(body.topic || "").trim();
    const sourceHint = body.sourceHint ? String(body.sourceHint).trim() : undefined;

    if (topic.length < 8) {
      return NextResponse.json(
        { error: "Topic is too short to investigate." },
        { status: 400 }
      );
    }

    const normalizedTopic = normalizeTopic(topic);
    const key = keyFor(area, topic);
    const now = new Date().toISOString();

    const existing = coverageRequests.get(key);
    const count = (existing?.count || 0) + 1;
    const sourceHintBonus = sourceHint ? 0.5 : 0;
    const score = count + sourceHintBonus;
    const thresholdMet = score >= 3;

    const record: CoverageRecord = {
      area,
      slug,
      topic,
      sourceHint,
      normalizedTopic,
      count,
      score,
      thresholdMet,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    coverageRequests.set(key, record);

    return NextResponse.json({
      record,
      notification: thresholdMet
        ? {
            title: "Coverage demand crossed threshold",
            message: `"${topic}" has enough reader demand to trigger a source-backed investigation.`,
            requestedTopic: topic,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to queue coverage request", detail: String(error) },
      { status: 500 }
    );
  }
}
