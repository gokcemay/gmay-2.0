import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { resolveShortLink } from "@/lib/shortlinks";

// Single dynamic route handling all legacy gmay.me short links.
// Real application routes (/lab, /about, ...) are static and always match first.
// Add new codes in src/lib/shortlinks.ts — no new route file needed.
export const Route = createFileRoute("/$shortCode")({
  loader: ({ params }) => {
    const destination = resolveShortLink(params.shortCode);
    if (!destination) throw notFound();
    throw redirect({ href: destination, statusCode: 302 });
  },
  component: () => null,
});
