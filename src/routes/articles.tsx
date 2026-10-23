import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from '@tanstack/react-query';

import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { ArticleList, substackPostsQueryOptions } from "@/components/site/Articles";
import { buttonStyles, CTABlock } from "@/components/site/CTA";
import { profileLinks } from "@/lib/profiles";

export const Route = createFileRoute("/articles")({
  head: ({ match }) => (localizeHead({
    meta: [
      { title: "Yazılar — Mühendislik, Yapay Zeka, Araştırma | gmay.me" },
      {
        name: "description",
        content:
          "Mühendisliğin Yapay Zeka Mentoru'nda yayımlanan mühendislik, yapay zekâ, araştırma ve teknoloji yazıları.",
      },
      { property: "og:title", content: "Yazılar — Mühendislik, Yapay Zeka, Araştırma" },
      {
        property: "og:description",
        content: "Mühendislik, yapay zeka ve araştırma üzerine editoryal içerikler.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/articles" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Yazılar — Mühendislik, Yapay Zeka, Araştırma",
          url: "https://gmay.me/articles",
          inLanguage: "tr-TR",
          description:
            "Mühendisliğin Yapay Zeka Mentoru'nda yayımlanan mühendislik, yapay zekâ, araştırma ve teknoloji yazıları.",
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          about: ["Mühendislik", "Yapay zekâ", "Akademik araştırma"],
          author: { "@id": "https://gmay.me/#person" },
        }),
      },
    ],
  }, match.context.language ?? 'en', "/articles")),
  loader: ({ context }) => context.queryClient.ensureQueryData(substackPostsQueryOptions),
  component: ArticlesPage,
});

function ArticlesPage() {
  const tx = useT();
  const { data } = useSuspenseQuery(substackPostsQueryOptions);

  return (
    <>
      <PageHeader
        eyebrow={tx("Yazılar")}
        title={tx("Yazılar")}
        description={tx("Mühendisliğin Yapay Zeka Mentoru'nda yayımlanan mühendislik, yapay zekâ, araştırma ve teknoloji yazıları.")}
      />

      <Section>
        <SectionHeader eyebrow={tx("Arşiv")} title={tx("Son yazılar")} />

        <div className="mt-8">
          <ArticleList
            posts={data?.posts}
            isLoading={false}
            hasError={Boolean(data?.error)}
            limit={12}
            columns={3}
          />
        </div>
      </Section>

      <Section>
        <CTABlock
          title={tx("Mühendisliğin Yapay Zeka Mentoru")}
          description={tx("Yeni yazıları e-posta ile almak için Substack üzerinden abone olabilirsiniz.")}
        >
          <a
            href={profileLinks.substack}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles.primary}
          >
            {tx("Substack'e Abone Ol")}</a>
        </CTABlock>
      </Section>
    </>
  );
}
