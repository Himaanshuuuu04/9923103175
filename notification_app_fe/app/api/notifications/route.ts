import { NextResponse } from 'next/server';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://4.224.186.213/evaluation-service';
// Prefer a server-side token (API_TOKEN) to avoid exposing secrets to the client.
const TOKEN = process.env.API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams.toString();
    const upstream = `${BASE}/notifications${params ? `?${params}` : ''}`;

    const res = await fetch(upstream, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      // keep credentials same-origin; this is a server-side fetch
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Proxy error' }, { status: 500 });
  }
}
