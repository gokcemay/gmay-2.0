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
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-px overflow-hidden border border-border bg-border", cols, className)}>
      {children}
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
  return (
    <article className="flex flex-col bg-card p-6 md:p-8">
      {label && (
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      )}
      <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{title}</h3>
      {body && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {footer && <div className="mt-6 pt-2">{footer}</div>}
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
  return (
    <article className="flex flex-col bg-card p-6 md:p-8">
      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        <span className="text-accent">{category}</span>
        <span aria-hidden="true">/</span>
        <time>{date}</time>
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
      <Link
        to="/articles"
        className="mt-6 text-sm font-medium text-foreground underline underline-offset-4"
      >
        Yazıyı oku
      </Link>
    </article>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-accent bg-muted/50 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
