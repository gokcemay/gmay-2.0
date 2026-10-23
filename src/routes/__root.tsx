import { useEffect, useRef, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { profileLinks } from "@/lib/profiles";



function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        name: "description",
        content: "Mühendislik, yapay zekâ, akademik araştırma, eğitim ve mühendislik araçları.",
      },
      { name: "author", content: "Gökçe Mehmet Ay" },
      { property: "og:site_name", content: "gmay.me" },
      { property: "og:title", content: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        property: "og:description",
        content: "Mühendislik, yapay zekâ, akademik araştırma, eğitim ve mühendislik araçları.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://gmay.me/og-gmay.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        name: "twitter:description",
        content: "Mühendislik, yapay zekâ, akademik araştırma, eğitim ve mühendislik araçları.",
      },
      { name: "twitter:image", content: "https://gmay.me/og-gmay.png" },
      {
        name: "google-site-verification",
        content: "yCenLJsTBp9GGeiRby7D2NewTPxA13uFHwOwwm8Tv7Q",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
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
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
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
      {standalone ? <Outlet /> : (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      )}
    </QueryClientProvider>
  );
}


