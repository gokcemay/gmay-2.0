import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { ContactForm } from '@/components/site/ContactForm';
import { emails, professionalProfiles } from "@/lib/profiles";

export const Route = createFileRoute("/iletisim")({
  head: ({ match }) => (localizeHead({
    meta: [
      { title: "İletişim — Eğitim, Danışmanlık, İş Birliği | gmay.me" },
      {
        name: "description",
        content:
          "Eğitim, danışmanlık, araştırma iş birliği, konuşma ve atölye talepleri için iletişim sayfası.",
      },
      { property: "og:title", content: "İletişim — Eğitim, Danışmanlık, İş Birliği" },
      { property: "og:description", content: "Profesyonel iletişim ve iş birliği fırsatları." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/iletisim" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/iletisim" }],
  }, match.context.language ?? 'en', "/iletisim")),
  component: ContactPage,
});

const topics = [
  { title: "Eğitim", body: "Kurumsal ve bireysel eğitim programları." },
  { title: "Danışmanlık", body: "Mühendislik ve Ar-Ge danışmanlığı." },
  { title: "Araştırma iş birliği", body: "Akademik ve endüstriyel iş birlikleri." },
  { title: "Konuşma / Atölye", body: "Etkinlik ve atölye davetleri." },
];

function ContactPage() {
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("İletişim")}
        title={tx("İletişim")}
        description={tx("Eğitim, danışmanlık, araştırma iş birliği ve etkinlik talepleri için iletişime geçebilirsiniz.")}
      />

      <Section>
        <SectionHeader eyebrow={tx("01")} title={tx("İletişim konuları")} />
        <GridPanel columns={4} className="mt-8">
          {tx(topics.map((t) => (
            <InfoCard key={t.title} title={tx(t.title)} body={t.body} />
          )))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={tx("02")}
          title={tx("E-posta")}
          description={tx("Doğrudan e-posta ile iletişime geçebilirsiniz.")}
        />
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-6 md:p-8">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {tx("Akademik / Kurumsal")}</p>
            <a
              href={`mailto:${emails.academic}`}
              className="mt-3 inline-block font-display text-lg font-semibold text-foreground underline underline-offset-4"
            >
              {tx(emails.academic)}
            </a>
          </div>
          <div className="bg-card p-6 md:p-8">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {tx("Genel iletişim")}</p>
            <a
              href={`mailto:${emails.general}`}
              className="mt-3 inline-block font-display text-lg font-semibold text-foreground underline underline-offset-4"
            >
              {tx(emails.general)}
            </a>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("03")} title={tx("Profesyonel profiller")} />
        <ul className="mt-8 flex flex-wrap gap-3">
          {tx(professionalProfiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tx(`${p.label} profili (yeni sekmede açılır)`)}
                className="inline-flex border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {tx(p.label)}
              </a>
            </li>
          )))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("04")} title={tx("İletişim formu")} />
        <div className="mt-8 max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
