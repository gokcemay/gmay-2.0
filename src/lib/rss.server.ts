export type SubstackPost = {
  title: string;
  link: string;
  pubDate: string | null;
  excerpt: string;
  category: string | null;
};

export type SubstackFeedResult = {
  posts: SubstackPost[];
  error: string | null;
};

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
  return match ? match[1] : value;
}

function tagContent(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  return m ? stripCdata(m[1]) : null;
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

export async function fetchSubstackPosts(): Promise<SubstackFeedResult> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;

  try {
    const response = await fetch(FEED_URL, {
      redirect: "follow",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": "gmay.me RSS Reader",
      },
    });

    if (!response.ok) {
      throw new Error(`Substack feed responded with HTTP ${response.status}`);
    }

    const xml = await response.text();
    const posts = parseFeed(xml);
    const value: SubstackFeedResult = { posts, error: posts.length ? null : "empty" };
    cache = { at: Date.now(), value };
    return value;
  } catch (error) {
    console.error("[substack-rss] fetch failed", error);
    if (cache) return cache.value;
    return { posts: [], error: "unavailable" };
  }
}
