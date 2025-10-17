import { NextRequest, NextResponse } from 'next/server';

// In-memory log for latest events (kept minimal for maintenance view)
const recentEvents: Array<{ ts: number; type: string; id?: string; status?: string; to?: string; error?: string }> = [];

function pushEvent(e: { ts: number; type: string; id?: string; status?: string; to?: string; error?: string }) {
  recentEvents.unshift(e);
  if (recentEvents.length > 15) recentEvents.pop();
}

export async function GET() {
  // Webhook setup verification echo
  return NextResponse.json({ ok: true, recentEvents });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Basic parsing per Meta webhook format
    const entries = body?.entry ?? [];
    for (const entry of entries) {
      const changes = entry?.changes ?? [];
      for (const change of changes) {
        const value = change?.value;
        const statuses = value?.statuses ?? [];
        for (const s of statuses) {
          pushEvent({
            ts: Date.now(),
            type: 'status',
            id: s?.id,
            status: s?.status,
            to: s?.recipient_id,
            error: s?.errors?.[0]?.title || s?.errors?.[0]?.code,
          });
        }
        const messages = value?.messages ?? [];
        for (const m of messages) {
          pushEvent({ ts: Date.now(), type: 'message', id: m?.id, to: value?.metadata?.display_phone_number });
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';

export const revalidate = 0;

// Note: Extra exports are disallowed in route modules; keep helpers internal only.


