import type { SubstackFeedResult, SubstackPost } from "./articles.types";
import { substackSnapshot } from "./articles.snapshot";

export type { SubstackFeedResult, SubstackPost };

const FEED_URL = "https://gmehmetay.substack.com/feed";
const ALLOWED_HOSTS = ["gmehmetay.substack.com"];
const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes

let cache: { at: number; value: SubstackFeedResult } | null = null;

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripCdata(value: string): string {
  const match = value.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  const inner = match?.[1];
  return inner === undefined ? value : inner;
}

function tagContent(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  const inner = m?.[1];
  return inner === undefined ? null : stripCdata(inner);
}

export function htmlToPlainText(html: string): string {
  const withoutBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ");
  return decodeEntities(withoutBlocks.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function makeExcerpt(text: string, max = 200): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 120 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[.,;:!?\-–—]+$/, "")}…`;
}

function isAllowedLink(link: string): boolean {
  try {
    const url = new URL(link);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function parseFeed(xml: string): SubstackPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  const posts: SubstackPost[] = [];

  for (const item of items) {
    const rawTitle = tagContent(item, "title");
    const rawLink = tagContent(item, "link");
    if (!rawTitle || !rawLink) continue;

    const link = decodeEntities(rawLink).trim();
    if (!isAllowedLink(link)) continue;

    const description = tagContent(item, "description") ?? "";
    const content = tagContent(item, "content:encoded") ?? "";
    const source = htmlToPlainText(description) || htmlToPlainText(content);
    const pubDateRaw = tagContent(item, "pubDate");
    const parsedDate = pubDateRaw ? new Date(pubDateRaw.trim()) : null;
    const category = tagContent(item, "category");

    posts.push({
      title: htmlToPlainText(rawTitle),
      link,
      pubDate: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null,
      excerpt: makeExcerpt(source),
      category: category ? htmlToPlainText(category) || null : null,
    });
  }

  return posts;
}

const isDev = process.env["NODE_ENV"] !== "production";

function devLog(...args: unknown[]) {
  if (isDev) console.info("[substack-rss]", ...args);
}

const REQUEST_TIMEOUT_MS = 10_000;

class TransientFeedError extends Error {}

async function fetchFeedOnce(): Promise<SubstackPost[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(FEED_URL, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": "gmay.me RSS Reader (+https://gmay.me)",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      const transient = response.status === 429 || response.status >= 500;
      const message = `HTTP ${response.status} (${contentType || "no content-type"})`;
      throw transient ? new TransientFeedError(message) : new Error(message);
    }

    const xml = await response.text();
    const posts = parseFeed(xml);
    devLog("fetched", {
      url: FEED_URL,
      finalUrl: response.url,
      status: response.status,
      contentType,
      bodyLength: xml.length,
      items: posts.length,
    });
    return posts;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSubstackPosts(): Promise<SubstackFeedResult> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;

  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const posts = await fetchFeedOnce();
      if (!posts.length) throw new TransientFeedError("feed parsed to 0 items");
      const value: SubstackFeedResult = { posts, error: null };
      cache = { at: Date.now(), value };
      return value;
    } catch (error) {
      lastError = error;
      const transient =
        error instanceof TransientFeedError ||
        (error instanceof Error && (error.name === "AbortError" || error.name === "TypeError"));
      devLog(`attempt ${attempt} failed`, error instanceof Error ? error.message : String(error));
      if (!transient || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }

  console.error(
    "[substack-rss] fetch failed:",
    lastError instanceof Error ? lastError.message : String(lastError),
  );

  // 1) stale server cache
  if (cache) {
    devLog("serving stale cache", { items: cache.value.posts.length });
    return cache.value;
  }

  // 2) bundled last-known-good snapshot
  if (substackSnapshot.length) {
    devLog("serving bundled snapshot", { items: substackSnapshot.length });
    return { posts: substackSnapshot, error: null };
  }

  // 3) user-facing error state
  return { posts: [], error: "unavailable" };
}
