import {
  detailInstruction,
  fieldContext,
  styleInstruction,
  taskInstructions,
} from "./promptBuilder.data";
import type { PromptFormState, ReadinessLevel } from "./promptBuilder.types";
import { translate } from './translate';
import type { Language } from './language';

export type ValidationErrors = Partial<Record<"field" | "task" | "outputFormat" | "context", string>>;

export function validateForm(form: PromptFormState): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!form.field) errors.field = "Mühendislik alanı seçin.";
  if (!form.task) errors.task = "Görev seçin.";
  if (!form.outputFormat) errors.outputFormat = "Çıktı biçimi seçin.";
  const context = form.context.trim();
  if (!context) errors.context = "Problem / bağlam alanını doldurun.";
  else if (context.length < 20) errors.context = "Bağlamı biraz daha ayrıntılı yazın (en az 20 karakter).";
  return errors;
}

export function getReadiness(form: PromptFormState): ReadinessLevel {
  let score = 0;
  const len = form.context.trim().length;
  if (len >= 80) score += 1;
  if (len >= 200) score += 1;
  if (form.constraints.trim().length >= 10) score += 1;
  if (form.styles.length >= 4) score += 1;
  if (score >= 3) return "Ayrıntılı";
  if (score >= 2) return "İyi";
  return "Temel";
}

function bullets(lines: string[]): string {
  return lines.map((l) => `- ${l}`).join("\n");
}

export function buildPrompt(form: PromptFormState, language: Language = 'tr'): string {
  const context = form.context.trim();
  const constraints = form.constraints.trim();

  const analysis: string[] = [
    ...(fieldContext[form.field] ?? []),
    ...(taskInstructions[form.task] ?? []),
    ...form.styles.map((s) => styleInstruction[s]).filter((s): s is string => Boolean(s)),
    "Kullandığın teknik terimleri doğru bağlamda kullan.",
    detailInstruction[form.detail] ?? "",
  ].filter(Boolean);

  if (language === 'en') {
    const t = (value: string) => translate(value, language);
    return [
      `Act as a ${t(form.field)} expert.`,
      `Your task:\n${t(form.task)}`,
      `Problem / context:\n${context}`,
      ...(constraints ? [`Constraints and special requirements:\n${constraints}`] : []),
      `During analysis:\n${bullets(analysis.map(t))}`,
      `Prepare your response in this format:\n${t(form.outputFormat)}`,
      `In the final section:\n${bullets(['summarize the key results', 'state critical uncertainties', 'identify additional data needs where necessary'])}`,
    ].join('\n\n');
  }

  const parts: string[] = [
    `Bir ${form.field} uzmanı gibi hareket et.`,
    `Görevin:\n${form.task}`,
    `Problem / bağlam:\n${context}`,
  ];

  if (constraints) {
    parts.push(`Kısıtlar ve özel gereksinimler:\n${constraints}`);
  }

  parts.push(`Analiz sırasında:\n${bullets(analysis)}`);
  parts.push(`Yanıtını şu formatta hazırla:\n${form.outputFormat}`);
  parts.push(
    [
      "Son bölümde:",
      bullets([
        "temel sonuçları özetle",
        "kritik belirsizlikleri belirt",
        "gerekiyorsa ek veri ihtiyacını belirt",
      ]),
    ].join("\n"),
  );

  return parts.join("\n\n");
}
