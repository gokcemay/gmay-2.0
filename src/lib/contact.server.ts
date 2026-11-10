import { contactEmail, contactSchema } from './contact.schema';

type Settings = { apiKey?: string; gatewayKey?: string; from?: string; to?: string };
const response = (ok: boolean, status = 200) => Response.json({ ok }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function handleContact(request: Request, settings: Settings, send: typeof fetch = fetch) {
  if (request.method !== 'POST') return response(false, 405);
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return response(false, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response(false, 415);
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return response(false, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) { await reader.cancel(); return response(false, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return response(false, 400); }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return response(false, 400);
  if (parsed.data.website) return response(true);
  if (!settings.apiKey || !settings.gatewayKey) return response(false, 503);
  const from = settings.from ?? 'GMA Website <contact@gmay.me>';
  const to = settings.to ?? 'gmehmetay@gmail.com';
  const email = contactEmail(parsed.data, new Date().toISOString());
  try {
    const result = await send('https://connector-gateway.lovable.dev/resend/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.gatewayKey}`, 'X-Connection-Api-Key': settings.apiKey, 'Idempotency-Key': `contact-${parsed.data.submissionId}` },
      body: JSON.stringify({ from, to: [to], reply_to: parsed.data.email, ...email }),
      signal: AbortSignal.timeout(20000),
    });
    if (!result.ok) {
      // Do not log submitted personal information or provider bodies that may echo it.
      console.error('Contact email refused', { status: result.status });
      return response(false, 502);
    }
    const body = await result.json() as { id?: string };
    if (!body.id) return response(false, 502);
    console.info('Contact email accepted', { id: body.id });
    return response(true);
  } catch { console.error('Contact email unavailable'); return response(false, 502); }
}