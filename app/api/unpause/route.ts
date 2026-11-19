import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10_000;

/**
 * Supabase pauses Free Plan projects after a week of low *database* activity,
 * so pinging the project domain does nothing — the keepalive has to issue a
 * real PostgREST query. The table lives in a Supabase project that is not part
 * of this repository, hence the configuration via env.
 */
function keepaliveUrl(): string | null {
  const base = process.env.SUPABASE_URL;
  const table = process.env.SUPABASE_KEEPALIVE_TABLE;
  if (!base || !table) return null;

  const url = new URL(`${base.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(table)}`);
  url.searchParams.set("select", process.env.SUPABASE_KEEPALIVE_COLUMN || "id");
  url.searchParams.set("limit", "1");
  return url.toString();
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Vercel sends `Authorization: Bearer <CRON_SECRET>`.
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET is not configured; refusing to run the keepalive.");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = keepaliveUrl();
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn(
      "Supabase keepalive is not configured (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_KEEPALIVE_TABLE); skipping.",
    );
    return NextResponse.json({ skipped: true, reason: "Supabase keepalive not configured" });
  }

  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`Supabase keepalive failed: ${response.status} ${response.statusText}`);
      return NextResponse.json({ ok: false, status: response.status }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      status: response.status,
      ms: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("Supabase keepalive request error:", error);
    return NextResponse.json({ ok: false, error: "Request failed" }, { status: 502 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
