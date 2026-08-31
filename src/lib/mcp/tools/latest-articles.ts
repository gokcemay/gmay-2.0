import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchSubstackPosts } from "@/lib/rss.server";

export default defineTool({
  name: "latest_articles",
  title: "Son yazılar",
  description:
    "Gökçe Mehmet Ay'ın 'Mühendisliğin Yapay Zekâ Mentoru' Substack bülteninden yayımlanmış son yazıları listeler.",
  inputSchema: {
    limit: z.number().int().min(1).max(12).optional().describe("Kaç yazı döndürülsün (1-12)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const feed = await fetchSubstackPosts();
    const posts = feed.posts.slice(0, limit ?? 5).map((p) => ({
      title: p.title,
      url: p.link,
      published: p.pubDate,
      excerpt: p.excerpt,
    }));

    const out = { source: "https://gmehmetay.substack.com", error: feed.error, posts };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
      structuredContent: out,
    };
  },
});
