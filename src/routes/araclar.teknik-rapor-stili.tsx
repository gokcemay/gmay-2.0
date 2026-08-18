import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";

const description =
  "Teknik rapor yazımı için Türkçe ve İngilizce Claude skill'i: deney raporu, proje raporu, fizibilite ve SOP dokümanlarında tutarlı dil, birim ve başlık düzeni.";

const REPO_URL = "https://github.com/gokcemay/teknik-rapor-stili";
const SKILL_URL =
  "https://github.com/gokcemay/teknik-rapor-stili/raw/main/dist/teknik-rapor-stili.skill";

export const Route = createFileRoute("/araclar/teknik-rapor-stili")({
  head: () => ({
    meta: [
      { title: "Teknik Rapor Stili — Claude Skill | GMA Engineering Lab" },
      { name: "description", content: description },
      { property: "og:title", content: "Teknik Rapor Stili — Claude Skill" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/araclar/teknik-rapor-stili" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/araclar/teknik-rapor-stili" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Teknik Rapor Stili",
          url: "https://gmay.me/araclar/teknik-rapor-stili",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          inLanguage: "tr-TR",
          description,
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          author: { "@id": "https://gmay.me/#person" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }),
  component: TeknikRaporStiliPage,
});

const useCases = [
  {
    label: "01",
    title: "Yazma",
    body: "Konu, kapsam ve veriler verildiğinde raporu sıfırdan, tutarlı bir teknik dille üretir.",
  },
  {
    label: "02",
    title: "Düzenleme",
    body: "Mevcut metni stil kurallarına göre düzeltir; dil, birim ve başlık düzenini standarda çeker.",
  },
  {
    label: "03",
    title: "Denetim",
    body: "Metni değiştirmeden tarar ve bulguları tablo halinde raporlar; kararı yazara bırakır.",
  },
];

const docTypes = [
  "Deney / test raporu",
  "Proje ara ve sonuç raporu",
  "Danışmanlık dönem raporu",
  "Fizibilite raporu",
  "SOP (standart çalışma talimatı)",
];

const shortcuts = [
  { cmd: "/rapor", desc: "Türkçe teknik rapor üretimi" },
  { cmd: "/rapor-en", desc: "İngilizce teknik rapor üretimi" },
  { cmd: "/stil", desc: "Metni değiştirmeden stil denetimi" },
  { cmd: "/duzelt", desc: "Mevcut metni kurallara göre düzeltme" },
  { cmd: "/iskelet", desc: "Rapor iskeleti ve bölüm planı" },
  { cmd: "/rapor-tr-en", desc: "İki dilli (TR + EN) rapor" },
];

const claudeCodeCommands = `claude plugin marketplace add gokcemay/teknik-rapor-stili
claude plugin install teknik-rapor-stili@gokcemay-plugins`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative border border-border bg-muted/50">
      <pre className="overflow-x-auto px-4 py-4 pr-28 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute top-2.5 right-2.5 border border-border bg-card px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase hover:text-foreground"
      >
        {copied ? "Kopyalandı" : "Kopyala"}
      </button>
    </div>
  );
}

function TeknikRaporStiliPage() {
  const [tab, setTab] = useState<"code" | "app">("code");

  return (
    <>
      <PageHeader
        eyebrow="Engineering Lab"
        title="Teknik Rapor Stili"
        description="Teknik rapor yazımı için Türkçe ve İngilizce Claude skill'i — Google developer documentation style guide'dan rapor türüne uyarlanmış."
      />

      <Section>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background"
          >
            GitHub'da incele
          </a>
          <a
            href={SKILL_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center border border-border px-5 py-3 text-sm font-medium text-foreground hover:border-foreground"
          >
            Skill dosyasını indir
          </a>
        </div>
      </Section>

      <Section id="ne-ise-yarar">
        <SectionHeader
          eyebrow="01"
          title="Ne işe yarar"
          description="Skill üç çalışma biçimini destekler; hepsinde aynı stil kuralları geçerlidir."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((u) => (
            <article key={u.title} className="border border-border bg-card p-5 md:p-6">
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {u.label}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Kapsanan doküman türleri
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {docTypes.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="kurulum">
        <SectionHeader eyebrow="02" title="Kurulum" />
        <div className="mt-8 max-w-3xl">
          <div role="tablist" aria-label="Kurulum yöntemi" className="flex flex-wrap gap-px bg-border">
            {(
              [
                { id: "code", label: "Claude Code" },
                { id: "app", label: "Claude uygulaması" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={
                  tab === t.id
                    ? "bg-foreground px-4 py-2.5 font-mono text-xs tracking-[0.15em] text-background uppercase"
                    : "bg-card px-4 py-2.5 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase hover:text-foreground"
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "code" ? (
              <div>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Terminalde aşağıdaki iki komutu sırayla çalıştırın.
                </p>
                <CodeBlock code={claudeCodeCommands} />
              </div>
            ) : (
              <div>
                <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-mono text-xs text-accent">01</span>
                    <span>
                      <code className="font-mono text-xs text-foreground">
                        teknik-rapor-stili.skill
                      </code>{" "}
                      dosyasını indirin.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-xs text-accent">02</span>
                    <span>Claude uygulamasında yeni bir sohbet açın ve dosyayı sohbete yükleyin.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-xs text-accent">03</span>
                    <span>
                      Görünen <strong className="text-foreground">Save skill</strong> düğmesine basın;
                      skill hesabınıza eklenir.
                    </span>
                  </li>
                </ol>
                <div className="mt-4">
                  <CodeBlock code={SKILL_URL} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section id="kisayollar">
        <SectionHeader
          eyebrow="03"
          title="Kısayollar"
          description="Sohbette doğrudan yazabileceğiniz komutlar."
        />
        <div className="mt-8 max-w-3xl overflow-x-auto border border-border">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
                  Komut
                </th>
                <th className="px-4 py-3 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
                  Açıklama
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((s) => (
                <tr key={s.cmd} className="border-b border-border last:border-b-0 bg-card">
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-foreground">
                    {s.cmd}
                  </td>
                  <td className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="neyi-cozer">
        <SectionHeader eyebrow="04" title="Neyi çözer" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Teknik raporlarda en sık tekrarlayan tutarsızlıkları giderir: Türkçe metinde ondalık ayırıcı
          olarak virgül, İngilizce metinde nokta kullanımı; başlıklarda cümle düzeni; kesme işaretinin
          doğru kullanımı; ölçüm sonuçlarının deney koşulları ve belirsizlik değeriyle birlikte
          verilmesi. Böylece rapor dili kişiden kişiye değil, tanımlı bir kural setine göre şekillenir.
        </p>
      </Section>

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          CC BY 4.0 lisanslı. İçerik, Creative Commons Attribution 4.0 lisanslı Google developer
          documentation style guide'dan türetilmiş uyarlamalar içerir.
        </p>
      </Section>
    </>
  );
}
