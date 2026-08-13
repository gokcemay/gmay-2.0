import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { buttonStyles } from "@/components/site/CTA";
import { book } from "@/lib/profiles";
import bookCover from "@/assets/makine-muhendisleri-icin-100-prompt-kapak.jpg";
import academicCover from "@/assets/AAiBAKapak.jpg.asset.json";
import hekateCover from "@/assets/hekate-cover.jpg.asset.json";
import kanyonCover from "@/assets/KBTKapak.jpg.asset.json";

export const Route = createFileRoute("/kitaplar")({
  head: () => ({
    meta: [
      { title: "Kitaplar | Gökçe Mehmet Ay" },
      {
        name: "description",
        content:
          "Gökçe Mehmet Ay'ın mühendislik, teknoloji, akademik araştırma ve bilimkurgu kitapları.",
      },
      { property: "og:title", content: "Kitaplar | Gökçe Mehmet Ay" },
      {
        property: "og:description",
        content:
          "Gökçe Mehmet Ay'ın mühendislik, teknoloji, akademik araştırma ve bilimkurgu kitapları.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/kitaplar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/kitaplar" }],
  }),
  component: BooksPage,
});

type BookItem = {
  title: string;
  author: string;
  description: string;
  cover: string;
  alt: string;
  url?: string;
  cta?: string;
};

const engineeringBooks: BookItem[] = [
  {
    title: book.fullTitle,
    author: book.author,
    description:
      "Mühendislerin üretken yapay zekâyı teknik iş akışlarında daha sistematik kullanmasına yardımcı olmak üzere hazırlanmış bir kaynak.",
    cover: bookCover,
    alt: book.coverAlt,
    url: book.url,
    cta: "Google Play Books'ta İncele",
  },
  {
    title: "Akademik Araştırmalar İçin Bilişim Araçları",
    author: "Gökçe Mehmet Ay",
    description:
      "Akademik araştırma süreçlerinde kullanılan dijital araçlar ve çevrimiçi kaynaklara yönelik bir çalışma.",
    cover: academicCover.url,
    alt: "Akademik Araştırmalar İçin Bilişim Araçları kitap kapağı",
  },
];

const literaryBooks: BookItem[] = [
  {
    title: "Hekate'deki Sır",
    author: "Gökçe Mehmet Ay",
    description: "Bilimkurgu ve uzay temalarını merkezine alan kurgu çalışması.",
    cover: hekateCover.url,
    alt: "Hekate'deki Sır kitap kapağı",
  },
  {
    title: "Kanyonaltı'nda Bir Tekinsiz",
    author: "Gökçe Mehmet Ay",
    description:
      "Bilimkurgu ve tekinsiz anlatılar ekseninde kurgulanan öykülerden oluşan bir çalışma.",
    cover: kanyonCover.url,
    alt: "Kanyonaltı'nda Bir Tekinsiz kitap kapağı",
  },
];

function BookCard({ item }: { item: BookItem }) {
  return (
    <article className="flex flex-col border border-border bg-card sm:flex-row">
      <div className="flex items-center justify-center bg-muted p-6 sm:w-[220px] sm:shrink-0">
        <img
          src={item.cover}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 60vw, 220px"
          className="max-h-[300px] w-full max-w-[180px] object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-lg leading-snug font-semibold break-words text-foreground">
          {item.title}
        </h3>
        <p className="mt-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {item.author}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonStyles.secondary} mt-6 self-start`}
          >
            {item.cta}
          </a>
        )}
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
        description="Mühendislik, teknoloji, araştırma ve bilimkurgu üzerine yayımlanmış çalışmalar."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Mühendislik & Teknoloji" />
        <div className="mt-8 grid max-w-4xl gap-6">
          {engineeringBooks.map((b) => (
            <BookCard key={b.title} item={b} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="02" title="Edebiyat" />
        <div className="mt-8 grid max-w-4xl gap-6">
          {literaryBooks.map((b) => (
            <BookCard key={b.title} item={b} />
          ))}
        </div>
      </Section>
    </>
  );
}
