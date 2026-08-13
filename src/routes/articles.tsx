import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { ArticleList, substackPostsQueryOptions } from "@/components/site/Articles";
import { buttonStyles, CTABlock } from "@/components/site/CTA";
import { profileLinks } from "@/lib/profiles";

export const Route = createFileRoute("/articles")({
  head: () => ({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(substackPostsQueryOptions),
  component: ArticlesPage,
});

function ArticlesPage() {
  const { data, isLoading, isError } = useQuery(substackPostsQueryOptions);

  return (
    <>
      <PageHeader
        eyebrow="Yazılar"
        title="Yazılar"
        description="Mühendisliğin Yapay Zeka Mentoru'nda yayımlanan mühendislik, yapay zekâ, araştırma ve teknoloji yazıları."
      />

      <Section>
        <SectionHeader eyebrow="Arşiv" title="Son yazılar" />

        <div className="mt-8">
          <ArticleList
            posts={data?.posts}
            isLoading={isLoading}
            hasError={isError || Boolean(data?.error)}
            limit={12}
            columns={3}
          />
        </div>
      </Section>

      <Section>
        <CTABlock
          title="Mühendisliğin Yapay Zeka Mentoru"
          description="Yeni yazıları e-posta ile almak için Substack üzerinden abone olabilirsiniz."
        >
          <a
            href={profileLinks.substack}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles.primary}
          >
            Substack'e Abone Ol
          </a>
        </CTABlock>
      </Section>
    </>
  );
}
