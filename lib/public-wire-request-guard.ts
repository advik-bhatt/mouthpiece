import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function cleanInput(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

export function cleanFocus(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => cleanInput(item, 40))
    .filter(Boolean)
    .slice(0, 8);
}

export function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(request: Request, key: string, limit: number) {
  const now = Date.now();
  const ip = requestIp(request);
  const bucketKey = `${key}:${ip}`;
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (bucket.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Wait a minute and try again." },
      { status: 429 }
    );
  }

  bucket.count += 1;
  return null;
}

export function requireAdmin(request: Request) {
  const configuredSecret = process.env.PUBLIC_WIRE_ADMIN_SECRET;

  if (!configuredSecret) {
    return NextResponse.json(
      { error: "Admin scan route is disabled until PUBLIC_WIRE_ADMIN_SECRET is set." },
      { status: 403 }
    );
  }

  const providedSecret = request.headers.get("x-public-wire-admin-secret");

  if (providedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
