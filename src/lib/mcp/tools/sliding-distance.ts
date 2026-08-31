import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  calculateReciprocatingSlidingDistance,
  calculateRotarySlidingDistance,
} from "@/lib/slidingDistance.logic";

export default defineTool({
  name: "sliding_distance",
  title: "Kayma mesafesi hesabı",
  description:
    "Dönel (pin-on-disc) veya ileri-geri (reciprocating) hareket için toplam kayma mesafesi, çevrim sayısı ve kayma hızını hesaplar.",
  inputSchema: {
    mode: z.enum(["rotary", "reciprocating"]).describe("Hareket tipi"),
    track_radius_mm: z
      .number()
      .positive()
      .optional()
      .describe("Dönel mod: aşınma izi yarıçapı [mm]"),
    rpm: z.number().positive().optional().describe("Dönel mod: dönme hızı [rpm]"),
    stroke_mm: z.number().positive().optional().describe("İleri-geri mod: strok uzunluğu [mm]"),
    frequency_Hz: z
      .number()
      .positive()
      .optional()
      .describe("İleri-geri mod: çevrim frekansı [Hz]"),
    duration_min: z.number().positive().describe("Deney süresi [dakika]"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const t = input.duration_min * 60;
    let results = null;
    let perUnitLabel = "";

    if (input.mode === "rotary") {
      if (!input.track_radius_mm || !input.rpm) {
        return {
          content: [
            { type: "text" as const, text: "Dönel mod için track_radius_mm ve rpm gereklidir." },
          ],
          isError: true,
        };
      }
      results = calculateRotarySlidingDistance({
        r: input.track_radius_mm / 1000,
        n: input.rpm,
        t,
      });
      perUnitLabel = "distance_per_revolution_mm";
    } else {
      if (!input.stroke_mm || !input.frequency_Hz) {
        return {
          content: [
            {
              type: "text" as const,
              text: "İleri-geri mod için stroke_mm ve frequency_Hz gereklidir.",
            },
          ],
          isError: true,
        };
      }
      results = calculateReciprocatingSlidingDistance({
        L: input.stroke_mm / 1000,
        f: input.frequency_Hz,
        t,
      });
      perUnitLabel = "distance_per_cycle_mm";
    }

    if (!results) {
      return {
        content: [{ type: "text" as const, text: "Girdiler geçersiz; hesap yapılamadı." }],
        isError: true,
      };
    }

    const out = {
      cycles: results.N,
      [perUnitLabel]: results.perUnit * 1000,
      total_sliding_distance_m: results.s,
      sliding_speed_m_per_s: results.v,
      notes:
        input.mode === "rotary"
          ? "s = 2πr·N, N = rpm·t/60. İdeal, kaymasız dönel hareket varsayılır."
          : "s = 2L·f·t. Ortalama hız verilir; anlık hız sinüzoidal harekette değişir.",
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
      structuredContent: out,
    };
  },
});
