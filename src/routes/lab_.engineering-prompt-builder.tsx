import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { buttonStyles } from "@/components/site/CTA";
import { book } from "@/lib/profiles";
import {
  defaultStyles,
  detailLevels,
  engineeringFields,
  outputFormats,
  responseStyles,
  taskTypes,
} from "@/lib/promptBuilder.data";
import {
  buildPrompt,
  getReadiness,
  validateForm,
  type ValidationErrors,
} from "@/lib/promptBuilder.logic";
import type { DetailLevel, PromptFormState } from "@/lib/promptBuilder.types";

export const Route = createFileRoute("/lab_/engineering-prompt-builder")({
  head: ({ match }) => (localizeHead({
    meta: [
      { title: "Engineering Prompt Builder | GMA Engineering Lab" },
      {
        name: "description",
        content:
          "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları oluşturun. Ücretsiz, API gerektirmeyen Engineering Prompt Builder.",
      },
      { property: "og:title", content: "Engineering Prompt Builder | GMA Engineering Lab" },
      {
        property: "og:description",
        content:
          "Mühendislik görevleri için yapılandırılmış, tekrar kullanılabilir yapay zekâ promptları oluşturun.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lab/engineering-prompt-builder" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/lab/engineering-prompt-builder" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Engineering Prompt Builder",
          url: "https://gmay.me/lab/engineering-prompt-builder",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          inLanguage: "tr-TR",
          description: "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları üreten ücretsiz tarayıcı tabanlı araç.",
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          author: { "@id": "https://gmay.me/#person" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }, match.context.language ?? 'en', "/lab/engineering-prompt-builder")),
  component: PromptBuilderPage,
});

const initialForm: PromptFormState = {
  field: "",
  task: "",
  outputFormat: "",
  context: "",
  constraints: "",
  detail: "Standart",
  styles: defaultStyles,
};

const labelClass = "block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase";
const controlClass =
  "mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

function FieldError({ message }: { message: string | undefined }) {
  const tx = useT();
  if (!message) return null;
  return <p className="mt-2 text-xs text-destructive">{tx(message)}</p>;
}

function PromptBuilderPage() {
  const tx = useT();
  const language = useLanguage();
  const [form, setForm] = useState<PromptFormState>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { setPrompt(current => current ? buildPrompt(form, language) : current); }, [language]);

  const readiness = getReadiness(form);

  const update = <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleStyle = (style: string) =>
    setForm((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setPrompt("");
      return;
    }
    setPrompt(buildPrompt(form, language));
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
    setPrompt("");
    setCopied(false);
  };

  return (
    <>
      <PageHeader
        eyebrow={tx("AI for Engineers")}
        title={tx("Engineering Prompt Builder")}
        description={tx("Mühendislik görevleri için daha açık, yapılandırılmış ve tekrar kullanılabilir yapay zekâ promptları oluşturun.")}
      />

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Bu araç bir yapay zekâ modeli çalıştırmaz. Seçimlerinize göre yapılandırılmış bir prompt oluşturur.")}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div>
              <label htmlFor="field" className={labelClass}>
                {tx("Mühendislik alanı *")}</label>
              <select
                id="field"
                className={controlClass}
                value={form.field}
                onChange={(e) => update("field", e.target.value)}
              >
                <option value="">{tx("Seçiniz")}</option>
                {tx(engineeringFields.map((f) => (
                  <option key={f} value={f}>
                    {tx(f)}
                  </option>
                )))}
              </select>
              <FieldError message={tx(errors.field)} />
            </div>

            <div>
              <label htmlFor="task" className={labelClass}>
                {tx("Görev *")}</label>
              <select
                id="task"
                className={controlClass}
                value={form.task}
                onChange={(e) => update("task", e.target.value)}
              >
                <option value="">{tx("Seçiniz")}</option>
                {tx(taskTypes.map((t) => (
                  <option key={t} value={t}>
                    {tx(t)}
                  </option>
                )))}
              </select>
              <FieldError message={tx(errors.task)} />
            </div>

            <div>
              <label htmlFor="output" className={labelClass}>
                {tx("Çıktı biçimi *")}</label>
              <select
                id="output"
                className={controlClass}
                value={form.outputFormat}
                onChange={(e) => update("outputFormat", e.target.value)}
              >
                <option value="">{tx("Seçiniz")}</option>
                {tx(outputFormats.map((o) => (
                  <option key={o} value={o}>
                    {tx(o)}
                  </option>
                )))}
              </select>
              <FieldError message={tx(errors.outputFormat)} />
            </div>

            <div>
              <label htmlFor="context" className={labelClass}>
                {tx("Problem / bağlam *")}</label>
              <textarea
                id="context"
                rows={5}
                className={controlClass}
                placeholder={tx("Örneğin: 42CrMo4 çelik mil üzerinde kuru kayma koşullarında aşınmayı azaltmak için uygun kaplama seçeneklerini karşılaştırmak istiyorum.")}
                value={form.context}
                onChange={(e) => update("context", e.target.value)}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {tx("Girdiğiniz bilgiler tarayıcınızda işlenir ve bu araç tarafından kaydedilmez.")}</p>
              <FieldError message={tx(errors.context)} />
            </div>

            <div>
              <label htmlFor="constraints" className={labelClass}>
                {tx("Kısıtlar ve özel gereksinimler")}</label>
              <textarea
                id="constraints"
                rows={3}
                className={controlClass}
                placeholder={tx("Standartlar, sıcaklık, yük, maliyet, malzeme, üretim yöntemi, çıktı uzunluğu veya diğer kısıtları yazabilirsiniz.")}
                value={form.constraints}
                onChange={(e) => update("constraints", e.target.value)}
              />
            </div>

            <fieldset>
              <legend className={labelClass}>{tx("Detay seviyesi")}</legend>
              <div className="mt-3 flex flex-wrap gap-4">
                {tx(detailLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="radio"
                      name="detail"
                      value={level}
                      checked={form.detail === level}
                      onChange={() => update("detail", level as DetailLevel)}
                      className="accent-accent"
                    />
                    {tx(level)}
                  </label>
                )))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>{tx("Yanıt yaklaşımı")}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {tx(responseStyles.map((style) => (
                  <label
                    key={style}
                    className="flex items-start gap-2 text-sm leading-snug text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={form.styles.includes(style)}
                      onChange={() => toggleStyle(style)}
                      className="mt-0.5 accent-accent"
                    />
                    {tx(style)}
                  </label>
                )))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className={buttonStyles.primary}>
                {tx("Prompt Oluştur")}</button>
              <button type="button" onClick={handleClear} className={buttonStyles.secondary}>
                {tx("Temizle")}</button>
              <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
                {tx("Prompt hazırlık durumu:")}{tx(readiness)}
              </span>
            </div>
          </form>

          <div className="flex flex-col gap-5">
            <div className="border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {tx("Oluşturulan Prompt")}</h2>
              {tx(prompt ? (
                <>
                  <textarea
                    readOnly
                    value={prompt}
                    rows={18}
                    aria-label={tx("Oluşturulan prompt")}
                    className="mt-4 w-full border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus:border-accent focus:outline-none"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={handleCopy} className={buttonStyles.primary}>
                      {tx("Kopyala")}</button>
                    <button type="button" onClick={handleClear} className={buttonStyles.secondary}>
                      {tx("Temizle")}</button>
                    <span
                      aria-live="polite"
                      className="font-mono text-xs tracking-[0.15em] text-accent uppercase"
                    >
                      {tx(copied ? "Kopyalandı" : "")}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {tx("Formu doldurup “Prompt Oluştur” düğmesine bastığınızda promptunuz burada görünecek.")}</p>
              ))}
            </div>

            <aside className="border border-border p-5">
              <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {tx("Daha fazla mühendislik promptu")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{tx(book.fullTitle)}</p>
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
              >
                {tx("Kitabı İncele")}</a>
            </aside>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {tx("Üretilen promptlar mühendislik kararlarının yerine geçmez. Yapay zekâ tarafından üretilen teknik sonuçlar bağımsız olarak doğrulanmalıdır.")}</p>

            <Link to="/lab" className="text-sm text-foreground underline underline-offset-4">
              {tx("Engineering Lab'e dön")}</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
