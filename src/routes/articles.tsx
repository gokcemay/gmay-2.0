import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { ArticleCard, GridPanel, PlaceholderNote } from "@/components/site/Cards";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Yazılar — Mühendislik, Yapay Zeka, Araştırma | gmay.me" },
      {
        name: "description",
        content:
          "Mühendislik, yapay zeka, araştırma ve teknoloji üzerine yazılar ve bülten içerikleri.",
      },
      { property: "og:title", content: "Yazılar — Mühendislik, Yapay Zeka, Araştırma" },
      {
        property: "og:description",
        content: "Mühendislik, yapay zeka ve araştırma üzerine editoryal içerikler.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlesPage,
});

const categories = ["Tümü", "AI for Engineers", "Mechanical", "Tribology", "Research"];

const placeholders = Array.from({ length: 6 }, () => ({
  title: "Yazı başlığı yer tutucusu",
  category: "Kategori",
  date: "—",
  excerpt: "Yazı özeti burada yer alacaktır. İçerik kaynağı henüz bağlanmadı.",
}));

function ArticlesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yazılar"
        title="Yazılar"
        description="Mühendislik, yapay zeka, araştırma ve teknoloji üzerine yazılar. Bülten içerikleri ileride bu sayfada listelenecektir."
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="border border-border px-3 py-1.5 font-mono text-xs tracking-wide text-muted-foreground uppercase"
            >
              {c}
            </span>
          ))}
        </div>

        <SectionHeader
          eyebrow="Arşiv"
          title="Son yazılar"
          description="Aşağıdaki kartlar yapısal yer tutuculardır."
        />

        <GridPanel columns={3} className="mt-8">
          {placeholders.map((a, i) => (
            <ArticleCard key={i} {...a} />
          ))}
        </GridPanel>

        <div className="mt-8">
          <PlaceholderNote>
            Bu sayfa, yazıların ileride bülten kaynağından yüklenebilmesi için hazırlandı. Şu anda
            harici bir bağlantı kurulmamıştır.
          </PlaceholderNote>
        </div>
      </Section>
    </>
  );
}
