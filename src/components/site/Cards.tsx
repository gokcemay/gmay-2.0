import { useT } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GridPanel({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const tx = useT();
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-px overflow-hidden border border-border bg-border", cols, className)}>
      {tx(children)}
    </div>
  );
}

export function InfoCard({
  label,
  title,
  body,
  footer,
}: {
  label?: string;
  title: string;
  body?: string;
  footer?: ReactNode;
}) {
  const tx = useT();
  return (
    <article className="flex flex-col bg-card p-6 md:p-7">
      {tx(label && (
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{tx(label)}</p>
      ))}
      <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{tx(title)}</h3>
      {tx(body && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tx(body)}</p>)}
      {tx(footer && <div className="mt-5">{tx(footer)}</div>)}
    </article>
  );
}

export function ArticleCard({
  title,
  category,
  date,
  excerpt,
}: {
  title: string;
  category: string;
  date: string;
  excerpt: string;
}) {
  const tx = useT();
  return (
    <article className="flex flex-col bg-card p-6 md:p-7">
      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        <span className="text-accent">{tx(category)}</span>
        <span aria-hidden="true">/</span>
        <time>{tx(date)}</time>
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug font-semibold text-foreground">
        {tx(title)}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{tx(excerpt)}</p>
      <Link
        to="/articles"
        className="mt-5 text-sm font-medium text-foreground underline underline-offset-4"
      >
        {tx("Yazıyı oku")}</Link>
    </article>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  const tx = useT();
  return (
    <p className="border-l-2 border-accent bg-muted/50 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
      {tx(children)}
    </p>
  );
}
