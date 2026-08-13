import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, PlaceholderNote } from "@/components/site/Cards";
import { buttonStyles } from "@/components/site/CTA";
import { book } from "@/lib/profiles";
import bookCover from "@/assets/makine-muhendisleri-icin-100-prompt-kapak.jpg";

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
      { property: "og:url", content: "/kitaplar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/kitaplar" }],
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
        eyebrow="Kitaplar"
        title="Kitaplar"
        description="Mühendislik ve teknoloji alanındaki yayınlar ile edebi çalışmalar."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Mühendislik ve Teknoloji" />

        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-[minmax(0,1fr)_2fr]">
          <div className="flex items-center justify-center bg-muted p-6">
            <img
              src={bookCover}
              alt={book.coverAlt}
              className="max-h-[420px] w-full max-w-[280px] object-contain"
            />
          </div>
          <div className="bg-card p-8 md:p-10">
            <h3 className="font-display text-xl leading-snug font-semibold text-foreground md:text-2xl">
              {book.fullTitle}
            </h3>
            <p className="mt-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {book.author}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Mühendislerin üretken yapay zekâyı teknik iş akışlarında daha sistematik kullanmasına
              yardımcı olmak üzere hazırlanmış bir kaynak.
            </p>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonStyles.secondary} mt-6`}
            >
              Google Play Books'ta İncele
            </a>
          </div>
        </div>

        <div className="mt-8">
          <PlaceholderNote>
            Diğer mühendislik ve teknoloji yayınları doğrulanmış bilgi sağlandığında eklenecektir.
          </PlaceholderNote>
        </div>
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
