import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/contact')({
  server: { handlers: {
    POST: async ({ request }) => {
      const { handleContact } = await import('@/lib/contact.server');
      return handleContact(request, {
        apiKey: process.env['RESEND_API_KEY'], gatewayKey: process.env['LOVABLE_API_KEY'],
        from: process.env['CONTACT_EMAIL_FROM'], to: process.env['CONTACT_EMAIL_TO'],
      });
    },
    GET: () => Response.json({ ok: false }, { status: 405, headers: { Allow: 'POST' } }),
  } },
});