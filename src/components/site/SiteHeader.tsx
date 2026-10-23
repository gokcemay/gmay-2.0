import { useT } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSelector } from './LanguageSelector';

const navItems = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/lab", label: "Lab" },
  { to: "/articles", label: "Yazılar" },
  { to: "/research", label: "Araştırma" },
  { to: "/egitim", label: "Eğitim & Danışmanlık" },
  { to: "/kitaplar", label: "Kitaplar" },
  { to: "/about", label: "Hakkımda" },
] as const;

export function SiteHeader() {
  const tx = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 md:px-6">
        <Link
          to="/"
          className="font-display text-sm tracking-[0.35em] text-foreground uppercase"
          onClick={() => setOpen(false)}
        >
          {tx("gmay.me")}</Link>

        <nav aria-label={tx("Main")} className="hidden xl:block">
          <ul className="flex items-center gap-4">
            {tx(navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="text-sm transition-colors hover:text-foreground"
                >
                  {tx(item.label)}
                </Link>
              </li>
            )))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link
            to="/iletisim"
            className="hidden rounded-md border border-foreground px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background sm:inline-flex"
          >
            {tx("İletişim")}</Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={tx(open ? "Menüyü kapat" : "Menüyü aç")}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground xl:hidden"
          >
            {tx(open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />)}
          </button>
        </div>
      </div>

      {tx(open && (
        <nav id="mobile-nav" aria-label={tx("Mobile")} className="border-t border-border xl:hidden">
          <ul className="mx-auto max-w-6xl px-6 py-2 md:px-10">
            {[...navItems, { to: "/iletisim", label: "İletişim" } as const].map((item) => (
              <li key={item.to} className="border-b border-border/60 last:border-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base"
                >
                  {tx(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </header>
  );
}
