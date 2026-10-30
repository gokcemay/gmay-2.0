import { createFileRoute } from "@tanstack/react-router";

// Short address for the standalone static app in public/araclar/teknik-resim-cad/.
const target = "/araclar/teknik-resim-cad/index.html";

export const Route = createFileRoute("/araclar/teknik-resim-cad")({
  server: {
    handlers: {
      GET: ({ request }) => Response.redirect(new URL(target, request.url).toString(), 302),
    },
  },
  beforeLoad: () => {
    if (typeof window !== "undefined") window.location.replace(target);
  },
});
