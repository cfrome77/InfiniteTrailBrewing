import { NextResponse } from 'next/server';

export async function POST() {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!projectId || !accessToken) {
    return NextResponse.json(
      { error: 'Missing Supabase Project ID or Access Token' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectId}/unpause`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Supabase API error: ${text}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for the Cron job if needed, though POST is preferred.
// Vercel Cron jobs usually perform GET requests.
export async function GET() {
  return POST();
}
