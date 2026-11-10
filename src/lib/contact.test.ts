import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactEmail, contactSchema } from './contact.schema';
import { handleContact } from './contact.server';

const valid = { name: 'Gökçe Test', email: 'visitor@example.com', organization: 'Ar-Ge', subject: 'Eğitim talebi', message: 'Türkçe karakterler: ğüşıöç', reason: 'training' as const, consent: true as const, website: '', submissionId: 'd9c101de-911b-4c5d-b8f7-ec48e242cf90' };
for (const [field, max] of Object.entries({ name: 120, email: 254, organization: 160, subject: 200, message: 5000 })) {
  test(`${field} rejects above ${max} characters`, () => assert.equal(contactSchema.safeParse({ ...valid, [field]: 'a'.repeat(max + 1) }).success, false));
}
for (const field of ['name', 'email', 'subject', 'message']) test(`${field} is required`, () => assert.equal(contactSchema.safeParse({ ...valid, [field]: ' ' }).success, false));
test('email must be valid', () => assert.equal(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success, false));
test('consent must be explicitly true', () => assert.equal(contactSchema.safeParse({ ...valid, consent: false }).success, false));
test('optional organization and reason may be empty', () => assert.equal(contactSchema.safeParse({ ...valid, organization: '', reason: '' }).success, true));
test('reject header injection', () => assert.equal(contactSchema.safeParse({ ...valid, subject: 'Hello\r\nBcc: attacker@example.com' }).success, false));
test('email escapes HTML and preserves Turkish text', () => { const mail = contactEmail({ ...valid, message: '<script>alert(1)</script> ğüşıöç' }, '2026-11-10T09:00:00.000Z'); assert.ok(mail.html.includes('&lt;script&gt;')); assert.ok(mail.text.includes('ğüşıöç')); assert.equal(mail.subject, '[gmay.me Contact] Training — Eğitim talebi'); });
test('empty reason omitted from subject', () => assert.equal(contactEmail({ ...valid, reason: '' }, '').subject, '[gmay.me Contact] Eğitim talebi'));
const request = (data: unknown) => new Request('https://gmay.me/api/public/contact', { method: 'POST', headers: { origin: 'https://gmay.me', 'content-type': 'application/json' }, body: JSON.stringify(data) });
const settings = { apiKey: 'test-key', gatewayKey: 'test-gateway' };
test('honeypot does not send mail', async () => { let calls = 0; const result = await handleContact(request({ ...valid, website: 'spam' }), settings, async () => { calls++; return Response.json({ id: 'x' }); }); assert.equal(result.status, 200); assert.equal(calls, 0); });
test('visitor reply-to and fixed recipient for valid submission', async () => { let payload: Record<string, unknown> = {}; const result = await handleContact(request(valid), settings, async (_url, init) => { payload = JSON.parse(String(init?.body)); return Response.json({ id: 'test-email' }); }); assert.equal(result.status, 200); assert.equal(payload['reply_to'], 'visitor@example.com'); assert.deepEqual(payload['to'], ['gmehmetay@gmail.com']); assert.equal(payload['from'], 'GMA Website <contact@gmay.me>'); });
test('provider failure is safe and not reported as success', async () => { const result = await handleContact(request(valid), settings, async () => new Response('private provider error', { status: 403 })); assert.equal(result.status, 502); assert.deepEqual(await result.json(), { ok: false }); });
test('unverified sender is a handled setup failure, not a 502 crash', async () => {
  const result = await handleContact(request(valid), settings, async () => Response.json({ name: 'validation_error', message: 'The gmay.me domain is not verified. Please verify your domain.' }, { status: 403 }));
  assert.equal(result.status, 422);
  assert.deepEqual(await result.json(), { ok: false });
});
test('malformed input sends nothing', async () => { let calls = 0; const result = await handleContact(request({}), settings, async () => { calls++; return Response.json({ id: 'x' }); }); assert.equal(result.status, 400); assert.equal(calls, 0); });
test('missing credentials cannot report success', async () => assert.equal((await handleContact(request(valid), {})).status, 503));
test('reject foreign origin', async () => { const req = request(valid); req.headers.set('origin', 'https://attacker.example'); assert.equal((await handleContact(req, settings)).status, 403); });