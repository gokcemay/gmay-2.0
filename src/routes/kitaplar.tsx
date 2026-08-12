import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, PlaceholderNote } from "@/components/site/Cards";

export const Route = createFileRoute("/kitaplar")({
  head: () => ({
    meta: [
      { title: "Kitaplar — Teknik ve Edebi Yayınlar | gmay.me" },
      {
        name: "description",
        content:
          "Gökçe Mehmet Ay'ın mühendislik ve teknoloji kitapları ile edebi yayınlarının listesi.",
      },
      { property: "og:title", content: "Kitaplar — Teknik ve Edebi Yayınlar" },
      { property: "og:description", content: "Mühendislik, teknoloji ve edebiyat yayınları." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BooksPage,
});

function BookCard({ title, note }: { title: string; note: string }) {
  return (
    <article className="flex flex-col bg-card">
      <div className="flex aspect-[3/4] items-center justify-center border-b border-border bg-muted">
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Kapak görseli
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-snug font-semibold text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>
      </div>
    </article>
  );
}

function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="Kitaplar"
        description="Mühendislik ve teknoloji alanındaki yayınlar ile edebi çalışmalar."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Mühendislik ve Teknoloji" />
        <GridPanel columns={3} className="mt-8">
          <BookCard
            title="Makine Mühendisleri için 100 Prompt"
            note="Kitap açıklaması ve künye bilgileri eklenecektir."
          />
          <BookCard title="Kitap yer tutucusu" note="Bilgi eklenecektir." />
          <BookCard title="Kitap yer tutucusu" note="Bilgi eklenecektir." />
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader eyebrow="02" title="Edebiyat" />
        <GridPanel columns={3} className="mt-8">
          <BookCard title="Kitap yer tutucusu" note="Bilgi eklenecektir." />
          <BookCard title="Kitap yer tutucusu" note="Bilgi eklenecektir." />
        </GridPanel>
        <div className="mt-8">
          <PlaceholderNote>
            Kitap açıklamaları, yayınevi ve bağlantı bilgileri doğrulanmış içerik sağlandığında
            eklenecektir.
          </PlaceholderNote>
        </div>
      </Section>
    </>
  );
}
