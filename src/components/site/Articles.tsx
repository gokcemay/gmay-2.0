import { useT, useLanguage } from '@/lib/i18n';
import { queryOptions } from "@tanstack/react-query";
import { getSubstackPosts } from "@/lib/articles.functions";
import { profileLinks } from "@/lib/profiles";
import type { SubstackPost, SubstackFeedResult } from "@/lib/articles.types";

export const substackPostsQueryOptions = queryOptions({
  queryKey: ["substack-posts"],
  queryFn: async (): Promise<SubstackFeedResult> => getSubstackPosts(),
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
});

export function formatTrDate(iso: string | null, language: string = "tr"): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export function SubstackArticleCard({ post }: { post: SubstackPost }) {
  const tx = useT();
  const language = useLanguage();
  const date = formatTrDate(post.pubDate, language);

  return (
    <article lang="tr" className="flex flex-col border border-border bg-card p-6 md:p-7">
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        {tx(post.category && <span className="text-accent">{tx(post.category)}</span>)}
        {tx(post.category && date && <span aria-hidden="true">/</span>)}
        {tx(date && <time dateTime={post.pubDate ?? undefined}>{tx(date)}</time>)}
      </div>
      <h3 className="mt-4 font-display text-lg leading-snug font-semibold text-foreground">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4"
        >
          {tx(post.title)}
        </a>
      </h3>
      {tx(post.excerpt && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{tx(post.excerpt)}</p>
      ))}
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 text-sm font-medium text-foreground underline underline-offset-4"
      >
        {tx("Yazıyı oku")}</a>
    </article>
  );
}

export function ArticleSkeleton({ count = 3 }: { count?: number }) {
  const tx = useT();
  return (
    <>
      {tx(Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col border border-border bg-card p-6 md:p-7">
          <div className="h-3 w-24 bg-muted" />
          <div className="mt-5 h-4 w-full bg-muted" />
          <div className="mt-2 h-4 w-3/4 bg-muted" />
          <div className="mt-5 h-3 w-full bg-muted" />
          <div className="mt-2 h-3 w-5/6 bg-muted" />
        </div>
      )))}
    </>
  );
}

export function ArticlesUnavailable() {
  const tx = useT();
  return (
    <div className="border border-dashed border-border bg-card p-6 md:p-8">
      <p className="text-sm leading-relaxed text-muted-foreground">{tx("Yazılar şu anda yüklenemiyor.")}</p>
      <a
        href={profileLinks.substack}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
      >
        {tx("Yazıları Substack'te görüntüle")}</a>
    </div>
  );
}

export function ArticleList({
  posts,
  isLoading,
  hasError,
  limit,
  columns = 3,
}: {
  posts: SubstackPost[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  limit: number;
  columns?: 2 | 3;
}) {
  const tx = useT();
  const gridClass =
    columns === 2 ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  if (isLoading) {
    return (
      <div className={gridClass}>
        <ArticleSkeleton count={Math.min(limit, columns)} />
      </div>
    );
  }

  // Geçerli (bayat/anlık görüntü) içerik varsa hata durumunu gösterme.
  if (!posts || posts.length === 0) {
    return <ArticlesUnavailable />;
  }

  return (
    <div className={gridClass}>
      {tx(posts.slice(0, limit).map((post) => (
        <SubstackArticleCard key={post.link} post={post} />
      )))}
    </div>
  );
}
