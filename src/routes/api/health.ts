import { createFileRoute } from "@tanstack/react-router";
import { whatsappConfigured } from "@/lib/bot/whatsapp";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          service: "astro-vision-bot",
          whatsapp: whatsappConfigured(),
        }),
    },
  },
});
