import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  defaultStyles,
  detailLevels,
  engineeringFields,
  outputFormats,
  responseStyles,
  taskTypes,
} from "@/lib/promptBuilder.data";
import { buildPrompt, getReadiness, validateForm } from "@/lib/promptBuilder.logic";
import type { DetailLevel, PromptFormState } from "@/lib/promptBuilder.types";

export default defineTool({
  name: "engineering_prompt_builder",
  title: "Engineering Prompt Builder",
  description:
    "Mühendislik görevleri için yapılandırılmış Türkçe yapay zekâ promptu üretir (rol, görev, bağlam, kısıtlar, analiz gereksinimleri, çıktı biçimi, kalite kontrol).",
  inputSchema: {
    field: z.string().describe(`Mühendislik alanı. Seçenekler: ${engineeringFields.join(", ")}`),
    task: z.string().describe(`Görev. Seçenekler: ${taskTypes.join(", ")}`),
    output_format: z.string().describe(`Çıktı biçimi. Seçenekler: ${outputFormats.join(", ")}`),
    context: z.string().min(20).describe("Problem / bağlam açıklaması (en az 20 karakter)"),
    constraints: z.string().optional().describe("Kısıtlar ve özel gereksinimler"),
    detail: z
      .enum(["Kısa", "Standart", "Ayrıntılı"])
      .optional()
      .describe(`Detay seviyesi. Varsayılan: Standart. Seçenekler: ${detailLevels.join(", ")}`),
    styles: z
      .array(z.string())
      .optional()
      .describe(`Yanıt yaklaşımları. Seçenekler: ${responseStyles.join(", ")}`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const form: PromptFormState = {
      field: input.field,
      task: input.task,
      outputFormat: input.output_format,
      context: input.context,
      constraints: input.constraints ?? "",
      detail: (input.detail ?? "Standart") as DetailLevel,
      styles: input.styles ?? defaultStyles,
    };

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      return {
        content: [{ type: "text" as const, text: Object.values(errors).join(" ") }],
        isError: true,
      };
    }

    const prompt = buildPrompt(form);
    const readiness = getReadiness(form);

    return {
      content: [{ type: "text" as const, text: prompt }],
      structuredContent: { prompt, readiness },
    };
  },
});
