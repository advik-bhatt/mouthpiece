import { GoogleGenAI } from "@google/genai";
import type { LocalChange } from "@/lib/local-lens-data";

type GoogleEditorialResult = {
  provider: "Google Gemini";
  mode: "real-api" | "seeded-demo" | "api-error-fallback";
  purpose: string;
  decision: {
    publishable: boolean;
    classification: "resident-relevant" | "routine" | "unsupported" | "urgent";
    reason: string;
  };
  raw?: unknown;
  error?: string;
};

const GEMINI_TIMEOUT_MS = 10000;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeout!);
  }
}

function safeJson(text: string) {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function googleEditorialDecision(params: {
  area: string;
  change: LocalChange | undefined;
}): Promise<GoogleEditorialResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !params.change) {
    return {
      provider: "Google Gemini",
      mode: apiKey ? "seeded-demo" : "seeded-demo",
      purpose:
        "Gemini editorial decision layer. Add GEMINI_API_KEY and run a scan with a detected change to enable.",
      decision: {
        publishable: Boolean(params.change && params.change.status !== "rejected"),
        classification: params.change?.importance || "resident-relevant",
        reason: "Fallback decision based on seeded LocalLens policy.",
      },
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are the editorial decision layer for LocalLens, an autonomous civic change monitor.

Area: ${params.area}

Change candidate:
Title: ${params.change.title}
Category: ${params.change.category}
What changed: ${params.change.whatChanged}
Why it matters: ${params.change.whyItMatters}
Evidence: ${params.change.evidence.join("; ")}
Who is affected: ${params.change.whoIsAffected.join(", ")}

Rules:
- Publish only official/public civic updates with clear resident impact.
- Reject routine administrative updates with no clear resident impact.
- Reject rumors, private-person claims, unsupported crime claims, opinion, or speculation.
- Output JSON only.

Return:
{
  "publishable": boolean,
  "classification": "resident-relevant" | "routine" | "unsupported" | "urgent",
  "reason": "short reason"
}
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      }),
      GEMINI_TIMEOUT_MS,
      "Gemini editorial decision"
    );

    const text = response.text || "";
    const parsed = safeJson(text);

    return {
      provider: "Google Gemini",
      mode: "real-api",
      purpose:
        "Real Gemini API call completed. Gemini evaluated whether the detected civic change should be published.",
      decision: {
        publishable: Boolean(parsed?.publishable ?? params.change.status !== "rejected"),
        classification: parsed?.classification || params.change.importance,
        reason: parsed?.reason || "Gemini completed the editorial decision step.",
      },
      raw: response,
    };
  } catch (error) {
    return {
      provider: "Google Gemini",
      mode: "api-error-fallback",
      purpose:
        "Gemini editorial decision failed, so LocalLens fell back to its seeded editorial policy.",
      decision: {
        publishable: params.change.status !== "rejected",
        classification: params.change.importance,
        reason: "Fallback policy used because Gemini failed or timed out.",
      },
      error: String(error),
    };
  }
}
