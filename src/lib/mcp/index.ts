import { defineMcp } from "@lovable.dev/mcp-js";
import hertzContactTool from "./tools/hertz-contact";
import wearRateTool from "./tools/wear-rate";
import slidingDistanceTool from "./tools/sliding-distance";
import engineeringPromptTool from "./tools/engineering-prompt";
import latestArticlesTool from "./tools/latest-articles";

export default defineMcp({
  name: "gmay-2-0",
  title: "GMAY 2.0",
  version: "0.1.0",
  instructions:
    "GMA Engineering Lab araçları (gmay.me). Triboloji ve temas mekaniği hesapları için `hertz_contact`, `wear_rate` ve `sliding_distance`; yapılandırılmış mühendislik promptu üretmek için `engineering_prompt_builder`; son bülten yazıları için `latest_articles`. Hesap sonuçları deterministiktir ve mühendislik kararlarının yerine geçmez.",
  tools: [
    hertzContactTool,
    wearRateTool,
    slidingDistanceTool,
    engineeringPromptTool,
    latestArticlesTool,
  ],
});
