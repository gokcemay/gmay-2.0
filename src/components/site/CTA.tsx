import { useT } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center px-5 py-3 text-sm font-medium transition-colors rounded-md";

export const buttonStyles = {
  primary: cn(base, "bg-foreground text-background hover:bg-foreground/90"),
  secondary: cn(base, "border border-foreground text-foreground hover:bg-foreground hover:text-background"),
  ghost: cn(base, "px-0 py-0 text-foreground underline underline-offset-4"),
};

export function CTABlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const tx = useT();
  return (
    <div className="border border-border bg-card p-7 md:p-10">
      <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {tx(title)}
      </h2>
      {tx(description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {tx(description)}
        </p>
      ))}
      {tx(children && <div className="mt-6 flex flex-wrap gap-3">{tx(children)}</div>)}
    </div>
  );
}

export function ContactCTA() {
  const tx = useT();
  return (
    <CTABlock
      title={tx("İş birliği, eğitim veya danışmanlık için iletişime geçin.")}
      description={tx("Eğitim, kurumsal atölye, Ar-Ge danışmanlığı ve araştırma iş birlikleri için yazabilirsiniz.")}
    >
      <Link to="/iletisim" className={buttonStyles.primary}>
        {tx("İletişim")}</Link>
    </CTABlock>
  );
}
