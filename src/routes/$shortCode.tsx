import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { resolveShortLink } from "@/lib/shortlinks";

// Top-level public content routes. Case variants of these (e.g. /LAB, /Egitim)
// are duplicate crawlable URLs, so they permanently redirect to the canonical
// lowercase route. Short links are checked FIRST and stay case-sensitive:
// /KBT works, /kbt does not fall through to a content route.
const CONTENT_ROUTES = new Set([
  "lab",
  "egitim",
  "kitaplar",
  "articles",
  "research",
  "about",
  "iletisim",
]);

// Single dynamic route handling all legacy gmay.me short links.
// Real application routes (/lab, /about, ...) are static and always match first.
// Add new codes in src/lib/shortlinks.ts — no new route file needed.
export const Route = createFileRoute("/$shortCode")({
  loader: ({ params }) => {
    const destination = resolveShortLink(params.shortCode);
    if (destination) throw redirect({ href: destination, statusCode: 302 });
    const lower = params.shortCode.toLowerCase();
    if (lower !== params.shortCode && CONTENT_ROUTES.has(lower)) {
      throw redirect({ href: `/${lower}`, statusCode: 301 });
    }
    throw notFound();
  },
  component: () => null,
});
