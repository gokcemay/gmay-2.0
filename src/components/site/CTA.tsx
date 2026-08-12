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
  return (
    <div className="border border-border bg-card p-7 md:p-10">
      <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

export function ContactCTA() {
  return (
    <CTABlock
      title="İş birliği, eğitim veya danışmanlık için iletişime geçin."
      description="Eğitim, kurumsal atölye, Ar-Ge danışmanlığı ve araştırma iş birlikleri için yazabilirsiniz."
    >
      <Link to="/iletisim" className={buttonStyles.primary}>
        İletişim
      </Link>
    </CTABlock>
  );
}
