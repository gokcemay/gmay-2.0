import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { buttonStyles } from "@/components/site/CTA";
import { book } from "@/lib/profiles";
import bookCover from "@/assets/makine-muhendisleri-icin-100-prompt-kapak.jpg";
import academicCover from "@/assets/AAiBAKapak.jpg.asset.json";
import hekateCover from "@/assets/hekate-cover.jpg.asset.json";
import kanyonCover from "@/assets/KBTKapak.jpg.asset.json";

export const Route = createFileRoute("/kitaplar")({
  head: ({ match }) => (localizeHead({
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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Kitaplar | Gökçe Mehmet Ay",
          url: "https://gmay.me/kitaplar",
          inLanguage: "tr-TR",
          itemListElement: [...engineeringBooks, ...literaryBooks].map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Book",
              name: b.title,
              author: { "@type": "Person", name: b.author },
              description: b.description,
              inLanguage: "tr",
              ...(b.url ? { url: b.url } : {}),
            },
          })),
        }),
      },
    ],
  }, match.context.language ?? 'en', "/kitaplar")),
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
    url: "https://play.google.com/store/books/details?id=AtaRDwAAQBAJ",
    cta: "Google Play Books'ta İncele",
  },
  {
    title: "Kanyonaltı'nda Bir Tekinsiz",
    author: "Gökçe Mehmet Ay",
    description:
      "Bilimkurgu ve tekinsiz anlatılar ekseninde kurgulanan öykülerden oluşan bir çalışma.",
    cover: kanyonCover.url,
    alt: "Kanyonaltı'nda Bir Tekinsiz kitap kapağı",
    url: "https://www.kitapyurdu.com/kitap/kanyonaltinda-bir-tekinsiz/609790.html",
    cta: "İncele",
  },
];

function BookCard({ item }: { item: BookItem }) {
  const tx = useT();
  return (
    <article className="flex flex-col border border-border bg-card sm:flex-row">
      <div className="flex items-center justify-center bg-muted p-6 sm:w-[220px] sm:shrink-0">
        <img
          src={item.cover}
          alt={tx(item.alt)}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 60vw, 220px"
          className="max-h-[300px] w-full max-w-[180px] object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-lg leading-snug font-semibold break-words text-foreground">
          {tx(item.title)}
        </h3>
        <p className="mt-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {tx(item.author)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tx(item.description)}</p>
        {tx(item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonStyles.secondary} mt-6 self-start`}
          >
            {tx(item.cta)}
          </a>
        ))}
      </div>
    </article>
  );
}

function BooksPage() {
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("Kitaplar")}
        title={tx("Kitaplar")}
        description={tx("Mühendislik, teknoloji, araştırma ve bilimkurgu üzerine yayımlanmış çalışmalar.")}
      />

      <Section>
        <SectionHeader eyebrow={tx("01")} title={tx("Mühendislik & Teknoloji")} />
        <div className="mt-8 grid max-w-4xl gap-6">
          {tx(engineeringBooks.map((b) => (
            <BookCard key={b.title} item={b} />
          )))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("02")} title={tx("Edebiyat")} />
        <div className="mt-8 grid max-w-4xl gap-6">
          {tx(literaryBooks.map((b) => (
            <BookCard key={b.title} item={b} />
          )))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("03")} title={tx("İlgili içerikler")} />
        <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          <article className="border border-border bg-card p-5 md:p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              <Link to="/articles" className="hover:underline hover:underline-offset-4">
                {tx("Mühendislikte yapay zekâ yazıları")}</Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Kitaplarda ele alınan konuları genişleten yazılar ve bülten içerikleri.")}</p>
          </article>
          <article className="border border-border bg-card p-5 md:p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              <Link to="/lab/engineering-prompt-builder" className="hover:underline hover:underline-offset-4">
                {tx("Engineering Prompt Builder")}</Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Prompt kitabındaki yaklaşımı uygulamaya dönüştüren ücretsiz araç.")}</p>
          </article>
          <article className="border border-border bg-card p-5 md:p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              <Link to="/research" className="hover:underline hover:underline-offset-4">
                {tx("Araştırma ve yayınlar")}</Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Triboloji, yüzey mühendisliği ve akademik çalışmalar.")}</p>
          </article>
          <article className="border border-border bg-card p-5 md:p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              <Link to="/egitim" className="hover:underline hover:underline-offset-4">
                {tx("Eğitim ve danışmanlık")}</Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Kitap içerikleriyle bağlantılı uygulamalı eğitim programları.")}</p>
          </article>
        </div>
      </Section>
    </>
  );
}
