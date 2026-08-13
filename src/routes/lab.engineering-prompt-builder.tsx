import { useState } from "react";
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

export const Route = createFileRoute("/lab/engineering-prompt-builder")({
  head: () => ({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
  if (!message) return null;
  return <p className="mt-2 text-xs text-destructive">{message}</p>;
}

function PromptBuilderPage() {
  const [form, setForm] = useState<PromptFormState>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

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
    setPrompt(buildPrompt(form));
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
        eyebrow="AI for Engineers"
        title="Engineering Prompt Builder"
        description="Mühendislik görevleri için daha açık, yapılandırılmış ve tekrar kullanılabilir yapay zekâ promptları oluşturun."
      />

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Bu araç bir yapay zekâ modeli çalıştırmaz. Seçimlerinize göre yapılandırılmış bir prompt
          oluşturur.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div>
              <label htmlFor="field" className={labelClass}>
                Mühendislik alanı *
              </label>
              <select
                id="field"
                className={controlClass}
                value={form.field}
                onChange={(e) => update("field", e.target.value)}
              >
                <option value="">Seçiniz</option>
                {engineeringFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <FieldError message={errors.field} />
            </div>

            <div>
              <label htmlFor="task" className={labelClass}>
                Görev *
              </label>
              <select
                id="task"
                className={controlClass}
                value={form.task}
                onChange={(e) => update("task", e.target.value)}
              >
                <option value="">Seçiniz</option>
                {taskTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError message={errors.task} />
            </div>

            <div>
              <label htmlFor="output" className={labelClass}>
                Çıktı biçimi *
              </label>
              <select
                id="output"
                className={controlClass}
                value={form.outputFormat}
                onChange={(e) => update("outputFormat", e.target.value)}
              >
                <option value="">Seçiniz</option>
                {outputFormats.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FieldError message={errors.outputFormat} />
            </div>

            <div>
              <label htmlFor="context" className={labelClass}>
                Problem / bağlam *
              </label>
              <textarea
                id="context"
                rows={5}
                className={controlClass}
                placeholder="Örneğin: 42CrMo4 çelik mil üzerinde kuru kayma koşullarında aşınmayı azaltmak için uygun kaplama seçeneklerini karşılaştırmak istiyorum."
                value={form.context}
                onChange={(e) => update("context", e.target.value)}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Girdiğiniz bilgiler tarayıcınızda işlenir ve bu araç tarafından kaydedilmez.
              </p>
              <FieldError message={errors.context} />
            </div>

            <div>
              <label htmlFor="constraints" className={labelClass}>
                Kısıtlar ve özel gereksinimler
              </label>
              <textarea
                id="constraints"
                rows={3}
                className={controlClass}
                placeholder="Standartlar, sıcaklık, yük, maliyet, malzeme, üretim yöntemi, çıktı uzunluğu veya diğer kısıtları yazabilirsiniz."
                value={form.constraints}
                onChange={(e) => update("constraints", e.target.value)}
              />
            </div>

            <fieldset>
              <legend className={labelClass}>Detay seviyesi</legend>
              <div className="mt-3 flex flex-wrap gap-4">
                {detailLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="radio"
                      name="detail"
                      value={level}
                      checked={form.detail === level}
                      onChange={() => update("detail", level as DetailLevel)}
                      className="accent-accent"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>Yanıt yaklaşımı</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {responseStyles.map((style) => (
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
                    {style}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className={buttonStyles.primary}>
                Prompt Oluştur
              </button>
              <button type="button" onClick={handleClear} className={buttonStyles.secondary}>
                Temizle
              </button>
              <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
                Prompt hazırlık durumu: {readiness}
              </span>
            </div>
          </form>

          <div className="flex flex-col gap-5">
            <div className="border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Oluşturulan Prompt
              </h2>
              {prompt ? (
                <>
                  <textarea
                    readOnly
                    value={prompt}
                    rows={18}
                    aria-label="Oluşturulan prompt"
                    className="mt-4 w-full border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus:border-accent focus:outline-none"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={handleCopy} className={buttonStyles.primary}>
                      Kopyala
                    </button>
                    <button type="button" onClick={handleClear} className={buttonStyles.secondary}>
                      Temizle
                    </button>
                    <span
                      aria-live="polite"
                      className="font-mono text-xs tracking-[0.15em] text-accent uppercase"
                    >
                      {copied ? "Kopyalandı" : ""}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Formu doldurup “Prompt Oluştur” düğmesine bastığınızda promptunuz burada
                  görünecek.
                </p>
              )}
            </div>

            <aside className="border border-border p-5">
              <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Daha fazla mühendislik promptu
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{book.fullTitle}</p>
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
              >
                Kitabı İncele
              </a>
            </aside>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Üretilen promptlar mühendislik kararlarının yerine geçmez. Yapay zekâ tarafından
              üretilen teknik sonuçlar bağımsız olarak doğrulanmalıdır.
            </p>

            <Link to="/lab" className="text-sm text-foreground underline underline-offset-4">
              Engineering Lab'e dön
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
