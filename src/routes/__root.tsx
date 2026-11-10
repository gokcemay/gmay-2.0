import { useT, localizeHead } from '@/lib/i18n';
import { useEffect, useRef, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  redirect,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
  retainSearchParams,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { profileLinks } from "@/lib/profiles";
import { resolveLanguage, type Language } from '@/lib/language';
import { useLanguage } from '@/lib/i18n';

// Canonical lowercase paths of all public content routes (static segments only).
// Used by beforeLoad to 301-redirect uppercase variants like /LAB → /lab.
const CASE_SENSITIVE_CONTENT_ROUTES = new Set([
  "/lab",
  "/egitim",
  "/kitaplar",
  "/articles",
  "/research",
  "/about",
  "/iletisim",
  "/lab/hertz-contact-calculator",
  "/lab/hertz-line-contact-calculator",
  "/lab/gear-stress-calculator",
  "/lab/hardness-conversion-calculator",
  "/lab/surface-roughness-converter",
  "/lab/coefficient-of-friction-calculator",
  "/lab/contact-stress-studio",
  "/lab/pin-on-disc-wear-calculator",
  "/lab/wear-rate-calculator",
  "/lab/sliding-distance-calculator",
  "/lab/engineering-prompt-builder",
  "/lab/cadquery-prompt",
  "/araclar/teknik-rapor-stili",
  "/araclar/teknik-resim-cad",
  "/araclar/teknik-resim-cad/index.html",
]);



function NotFoundComponent() {
  const tx = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{tx("Page not found")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {tx("The page you're looking for doesn't exist or has been moved.")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {tx("Go home")}</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const tx = useT();
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {tx("This page didn't load")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tx("Something went wrong on our end. You can try refreshing or head back home.")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {tx("Try again")}</button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {tx("Go home")}</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; language?: Language }>()({
  validateSearch: (search: Record<string, unknown>) => ({ ...(typeof search['lang'] === 'string' ? { lang: search['lang'] } : {}) }),
  search: { middlewares: [retainSearchParams(['lang'])] },
  beforeLoad: ({ search, location }) => {
    // TanStack Router matches static segments case-insensitively, so /LAB would
    // otherwise render /lab with HTTP 200 (a duplicate crawlable URL). Permanently
    // redirect case variants of known content routes to the canonical lowercase
    // path. Legacy short links stay case-sensitive: /KBT lowercases to /kbt, which
    // is not a content route, so short-link handling is untouched.
    const lower = location.pathname.toLowerCase();
    if (lower !== location.pathname && CASE_SENSITIVE_CONTENT_ROUTES.has(lower)) {
      throw redirect({ href: `${lower}${location.searchStr}`, statusCode: 301 });
    }
    return { language: resolveLanguage(search.lang) };
  },
  head: ({ match }) => (localizeHead({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Gökçe Mehmet Ay" },
      { property: "og:site_name", content: "gmay.me" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "google-site-verification",
        content: "yCenLJsTBp9GGeiRby7D2NewTPxA13uFHwOwwm8Tv7Q",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-v2.ico" },
      { rel: "icon", type: "image/png", href: "/favicon-v2.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://gmay.me/#website",
              url: "https://gmay.me",
              name: "gmay.me",
              inLanguage: "tr-TR",
              description:
                "Mühendislik, yapay zekâ, akademik araştırma, eğitim ve mühendislik araçları.",
              publisher: { "@id": "https://gmay.me/#person" },
            },
            {
              "@type": "Person",
              "@id": "https://gmay.me/#person",
              name: "Gökçe Mehmet Ay",
              url: "https://gmay.me",
              jobTitle: "Mühendis ve Araştırmacı",
              knowsAbout: [
                "Mechanical Engineering",
                "Tribology",
                "Surface Engineering",
                "Coatings",
                "Artificial Intelligence for Engineers",
              ],
              sameAs: [
                profileLinks.linkedin,
                profileLinks.youtube,
                profileLinks.substack,
                profileLinks.avesis,
                profileLinks.scholar,
                profileLinks.orcid,
              ],
            },
          ],
        }),
      },
    ],
  }, match.context.language ?? 'en', "/")),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const tx = useT();
  const language = useLanguage();
  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body>
        {tx(children)}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const tx = useT();
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const analyticsInitialized = useRef(false);
  const standalone = location.pathname.replace(/\/$/, '') === '/lab/cadquery-prompt';

  useEffect(() => {
    if (standalone) return;
    initAnalytics();
    analyticsInitialized.current = true;
  }, [standalone]);

  useEffect(() => {
    if (standalone || !analyticsInitialized.current) return;
    trackPageView(location.pathname);
  }, [location.pathname, standalone]);

  return (
    <QueryClientProvider client={queryClient}>
      {tx(standalone ? <Outlet /> : (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      ))}
    </QueryClientProvider>
  );
}


