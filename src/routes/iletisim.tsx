import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, PlaceholderNote } from "@/components/site/Cards";
import { buttonStyles } from "@/components/site/CTA";

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
        eyebrow="Contact"
        title="İletişim"
        description="Eğitim, danışmanlık, araştırma iş birliği ve etkinlik talepleri için iletişime geçebilirsiniz."
      />

      <Section>
        <SectionHeader eyebrow="01" title="İletişim konuları" />
        <GridPanel columns={4} className="mt-10">
          {topics.map((t) => (
            <InfoCard key={t.title} title={t.title} body={t.body} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="02"
          title="Mesaj gönderin"
          description="Form şu an görsel bir yer tutucudur; gönderim altyapısı henüz bağlanmadı."
        />
        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
          <form
            aria-label="İletişim formu"
            onSubmit={(e) => e.preventDefault()}
            className="border border-border bg-card p-6 md:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-mono text-xs tracking-[0.2em] uppercase">
                  Ad Soyad
                </label>
                <input
                  id="name"
                  name="name"
                  disabled
                  placeholder="Yer tutucu"
                  className="border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-xs tracking-[0.2em] uppercase">
                  E-posta
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  placeholder="Yer tutucu"
                  className="border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <label htmlFor="message" className="font-mono text-xs tracking-[0.2em] uppercase">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                disabled
                placeholder="Yer tutucu"
                className="border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <button type="submit" disabled className={`${buttonStyles.primary} mt-6 opacity-50`}>
              Gönder (devre dışı)
            </button>
          </form>

          <aside className="space-y-6">
            <div className="border border-border bg-card p-6">
              <h3 className="font-display text-base font-semibold text-foreground">
                Doğrudan iletişim
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                E-posta adresi ve sosyal medya bağlantıları eklenecektir.
              </p>
            </div>
            <PlaceholderNote>
              Form gönderimi için arka uç altyapısı bu adımda kurulmadı.
            </PlaceholderNote>
          </aside>
        </div>
      </Section>
    </>
  );
}
