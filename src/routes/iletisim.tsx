import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, PlaceholderNote } from "@/components/site/Cards";
import { emails, professionalProfiles } from "@/lib/profiles";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const topics = [
  { title: "Eğitim", body: "Kurumsal ve bireysel eğitim programları." },
  { title: "Danışmanlık", body: "Mühendislik ve Ar-Ge danışmanlığı." },
  { title: "Araştırma iş birliği", body: "Akademik ve endüstriyel iş birlikleri." },
  { title: "Konuşma / Atölye", body: "Etkinlik ve atölye davetleri." },
];

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="İletişim"
        title="İletişim"
        description="Eğitim, danışmanlık, araştırma iş birliği ve etkinlik talepleri için iletişime geçebilirsiniz."
      />

      <Section>
        <SectionHeader eyebrow="01" title="İletişim konuları" />
        <GridPanel columns={4} className="mt-8">
          {topics.map((t) => (
            <InfoCard key={t.title} title={t.title} body={t.body} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="02"
          title="E-posta"
          description="Doğrudan e-posta ile iletişime geçebilirsiniz."
        />
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-6 md:p-8">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Akademik / Kurumsal
            </p>
            <a
              href={`mailto:${emails.academic}`}
              className="mt-3 inline-block font-display text-lg font-semibold text-foreground underline underline-offset-4"
            >
              {emails.academic}
            </a>
          </div>
          <div className="bg-card p-6 md:p-8">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Genel iletişim
            </p>
            <a
              href={`mailto:${emails.general}`}
              className="mt-3 inline-block font-display text-lg font-semibold text-foreground underline underline-offset-4"
            >
              {emails.general}
            </a>
          </div>
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
        <SectionHeader eyebrow="04" title="İletişim formu" />
        <div className="mt-8 max-w-2xl">
          <PlaceholderNote>
            Web sitesi üzerinden mesaj gönderme özelliği henüz aktif değildir. Lütfen yukarıdaki
            e-posta adreslerini kullanın.
          </PlaceholderNote>
        </div>
      </Section>
    </>
  );
}
