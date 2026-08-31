import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculateWearRate } from "@/lib/wearRate.logic";

export default defineTool({
  name: "wear_rate",
  title: "Aşınma oranı hesabı",
  description:
    "Aşınma hacminden veya kütle kaybı + yoğunluktan hacimsel aşınma oranı ve özgül aşınma oranı k_s = V / (F × s) hesaplar.",
  inputSchema: {
    wear_volume_mm3: z
      .number()
      .positive()
      .optional()
      .describe("Aşınma hacmi [mm³]. Verilmezse mass_loss_mg ve density_g_cm3 gereklidir."),
    mass_loss_mg: z.number().positive().optional().describe("Kütle kaybı [mg]"),
    density_g_cm3: z.number().positive().optional().describe("Malzeme yoğunluğu [g/cm³]"),
    force_N: z.number().positive().describe("Normal yük [N]"),
    sliding_distance_m: z.number().positive().describe("Toplam kayma mesafesi [m]"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    let V: number | undefined;
    let dm: number | undefined;

    if (typeof input.wear_volume_mm3 === "number") {
      V = input.wear_volume_mm3 * 1e-9;
    } else if (
      typeof input.mass_loss_mg === "number" &&
      typeof input.density_g_cm3 === "number"
    ) {
      dm = input.mass_loss_mg * 1e-6;
      V = dm / (input.density_g_cm3 * 1000);
    }

    if (V === undefined) {
      return {
        content: [
          {
            type: "text" as const,
            text: "wear_volume_mm3 ya da (mass_loss_mg + density_g_cm3) girilmelidir.",
          },
        ],
        isError: true,
      };
    }

    const results = calculateWearRate({
      V,
      F: input.force_N,
      s: input.sliding_distance_m,
      ...(dm !== undefined ? { dm } : {}),
    });

    if (!results) {
      return {
        content: [{ type: "text" as const, text: "Girdiler geçersiz; hesap yapılamadı." }],
        isError: true,
      };
    }

    const out = {
      wear_volume_mm3: results.V * 1e9,
      volumetric_wear_rate_mm3_per_m: results.qv * 1e9,
      specific_wear_rate_mm3_per_Nm: results.ks * 1e9,
      ...(results.qm !== undefined
        ? { mass_wear_rate_mg_per_m: results.qm * 1e6 }
        : {}),
      notes:
        "k_s = V / (F × s) özgül aşınma oranıdır [mm³/(N·m)]; boyutsuz Archard katsayısı değildir. Sonuçlar deney koşullarına bağlıdır.",
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
      structuredContent: out,
    };
  },
});
