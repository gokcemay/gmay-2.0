declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag.Gtag;
  }
}

type GtagArgs =
  | [string, Date]
  | [string, string, Record<string, unknown>?]
  | [string, string, string, Record<string, unknown>?];

namespace Gtag {
  export type Gtag = (...args: GtagArgs) => void;
}

function getMeasurementId(): string | undefined {
  return import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"];
}


export function initAnalytics(): void {
  const measurementId = getMeasurementId();

  if (!measurementId || typeof window === "undefined" || typeof window.gtag === "function") {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: GtagArgs) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false });
}

export function trackPageView(path: string): void {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "page_view", { page_path: path, send_to: measurementId });
}
