import { useT } from '@/lib/i18n';
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const tx = useT();
  return (
    <section id={id} className={cn("border-b border-border", className)}>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-18">{tx(children)}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const tx = useT();
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {tx(eyebrow && (
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">{tx(eyebrow)}</p>
        ))}
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-[2rem]">
          {tx(title)}
        </h2>
        {tx(description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{tx(description)}</p>
        ))}
      </div>
      {tx(action && <div className="shrink-0">{tx(action)}</div>)}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const tx = useT();
  return (
    <header className="border-b border-border">
      <div className="relative mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-18">
        {tx(eyebrow && (
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">{tx(eyebrow)}</p>
        ))}
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] font-semibold tracking-tight text-foreground md:text-5xl">
          {tx(title)}
        </h1>
        {tx(description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {tx(description)}
          </p>
        ))}
      </div>
    </header>
  );
}
