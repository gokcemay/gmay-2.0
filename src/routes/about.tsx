import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, PlaceholderNote } from "@/components/site/Cards";
import { ContactCTA } from "@/components/site/CTA";
import { professionalProfiles } from "@/lib/profiles";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Hakkımda — Gökçe Mehmet Ay | gmay.me" },
      {
        name: "description",
        content:
          "Mühendis, girişimci, araştırmacı, eğitmen ve yazar: Gökçe Mehmet Ay'ın profesyonel profili.",
      },
      { property: "og:title", content: "Hakkımda — Gökçe Mehmet Ay" },
      {
        property: "og:description",
        content: "Mühendislik, yapay zeka ve araştırmanın kesişiminde profesyonel profil.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const roles = [
  { title: "Engineer", body: "Mühendislik pratiği ve uygulamalı problem çözme." },
  { title: "Entrepreneur", body: "Girişimcilik ve ürün geliştirme." },
  { title: "Researcher", body: "Triboloji ve yüzey mühendisliği odaklı araştırma." },
  { title: "Educator", body: "Mühendisler için eğitim ve atölye çalışmaları." },
  { title: "Author", body: "Teknik ve edebi yayınlar." },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımda"
        title="Gökçe Mehmet Ay"
        description="Mühendislik pratiği, yapay zeka ve akademik araştırmanın kesişiminde çalışıyorum."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Profesyonel roller" />
        <GridPanel columns={3} className="mt-8">
          {roles.map((r) => (
            <InfoCard key={r.title} title={r.title} body={r.body} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader eyebrow="02" title="Profesyonel hikâye" />
        <div className="mt-8 max-w-2xl">
          <PlaceholderNote>
            Detaylı biyografi, deneyim ve zaman çizelgesi doğrulanmış bilgi sağlandığında
            eklenecektir.
          </PlaceholderNote>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="03" title="Profesyonel profiller" />
        <ul className="mt-8 flex flex-wrap gap-3">
          {professionalProfiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.label} profili (yeni sekmede açılır)`}
                className="inline-flex border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <ContactCTA />
      </Section>
    </>
  );
}
