import { Link } from "@tanstack/react-router";

const links = [
  { label: "LinkedIn", href: "#" },
  { label: "Substack", href: "https://gmehmetay.substack.com" },
  { label: "YouTube", href: "#" },
  { label: "Academic profile", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-sm tracking-[0.35em] text-foreground uppercase">gmay.me</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Engineering × AI × Research
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Links
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/iletisim"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Newsletter
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Mühendisliğin Yapay Zeka Mentoru
          </p>
          <a
            href="https://gmehmetay.substack.com"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
          >
            gmehmetay.substack.com
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground md:px-10">
          © {new Date().getFullYear()} Gökçe Mehmet Ay
        </div>
      </div>
    </footer>
  );
}
