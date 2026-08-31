import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculateSphereFlatHertz } from "@/lib/hertzContact.logic";

export default defineTool({
  name: "hertz_contact",
  title: "Hertz temas hesabı (küre–düzlem)",
  description:
    "Küre–düzlem elastik Hertz temasını hesaplar: maksimum temas basıncı, temas yarıçapı, temas alanı, ortalama basınç, indirgenmiş elastisite modülü ve yaklaşma miktarı.",
  inputSchema: {
    force_N: z.number().positive().describe("Normal yük [N]"),
    sphere_diameter_mm: z.number().positive().describe("Küre çapı [mm]"),
    e1_GPa: z.number().positive().describe("Küre elastisite modülü [GPa]"),
    nu1: z.number().min(0).lt(0.5).describe("Küre Poisson oranı (0 ≤ ν < 0.5)"),
    e2_GPa: z.number().positive().describe("Düzlem elastisite modülü [GPa]"),
    nu2: z.number().min(0).lt(0.5).describe("Düzlem Poisson oranı (0 ≤ ν < 0.5)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const results = calculateSphereFlatHertz({
      F: input.force_N,
      R: (input.sphere_diameter_mm / 1000) / 2,
      E1: input.e1_GPa * 1e9,
      nu1: input.nu1,
      E2: input.e2_GPa * 1e9,
      nu2: input.nu2,
    });

    if (!results) {
      return {
        content: [{ type: "text" as const, text: "Girdiler geçersiz; hesap yapılamadı." }],
        isError: true,
      };
    }

    const out = {
      max_pressure_MPa: results.p0 / 1e6,
      mean_pressure_MPa: results.pMean / 1e6,
      contact_radius_mm: results.a * 1000,
      contact_diameter_mm: results.contactDiameter * 1000,
      contact_area_mm2: results.area * 1e6,
      reduced_modulus_GPa: results.EStar / 1e9,
      approach_um: results.delta * 1e6,
      assumptions:
        "Klasik Hertz teorisi: elastik, sürtünmesiz, kuru temas; pürüzsüz yüzeyler; temas alanı gövde boyutlarına göre küçük; plastik deformasyon ve kaplama etkileri dikkate alınmaz.",
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
      structuredContent: out,
    };
  },
});
