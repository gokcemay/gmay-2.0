import { useT } from '@/lib/i18n';
import { Link } from "@tanstack/react-router";
import { profileLinks } from "@/lib/profiles";

const links = [
  { label: "LinkedIn", href: profileLinks.linkedin },
  { label: "YouTube", href: profileLinks.youtube },
  { label: "Substack", href: profileLinks.substack },
  { label: "AVESIS", href: profileLinks.avesis },
  { label: "Google Scholar", href: profileLinks.scholar },
  { label: "ORCID", href: profileLinks.orcid },
];

export function SiteFooter() {
  const tx = useT();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-sm tracking-[0.35em] text-foreground uppercase">{tx("gmay.me")}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {tx("Engineering × AI × Research")}</p>
        </div>

        <nav aria-label={tx("Footer")}>
          <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {tx("Bağlantılar")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {tx(links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tx(l.label)}
                </a>
              </li>
            )))}
            <li>
              <Link
                to="/iletisim"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {tx("İletişim")}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {tx("Newsletter")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {tx("Mühendisliğin Yapay Zeka Mentoru")}</p>
          <a
            href={profileLinks.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
          >
            {tx("gmehmetay.substack.com")}</a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted-foreground md:px-10">
          © {tx(new Date().getFullYear())} {tx("Gökçe Mehmet Ay")}</div>
      </div>
    </footer>
  );
}
