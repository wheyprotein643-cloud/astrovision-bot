import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { handleIncoming } from "@/lib/bot/engine";
import { markProcessed } from "@/lib/bot/session";
import {
  parseWhatsAppPayload,
  sendWhatsAppText,
  verifyWebhookChallenge,
} from "@/lib/bot/whatsapp";

function signatureOk(raw: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true;
  if (!header || !header.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const got = header.slice("sha256=".length);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(got, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/whatsapp/webhook")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const challenge = verifyWebhookChallenge(new URL(request.url));
        if (challenge) return new Response(challenge, { status: 200 });
        return new Response("Forbidden", { status: 403 });
      },
      POST: async ({ request }) => {
        const raw = await request.text();
        const header = request.headers.get("x-hub-signature-256");
        if (!signatureOk(raw, header)) {
          return new Response("Invalid signature", { status: 401 });
        }
        let payload: unknown;
        try {
          payload = JSON.parse(raw) as unknown;
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const messages = parseWhatsAppPayload(payload);
        for (const msg of messages) {
          if (!markProcessed(msg.id)) continue;
          try {
            const result = await handleIncoming({
              userId: `wa:${msg.from}`,
              phone: msg.from,
              profileName: msg.name,
              text: msg.text,
              channel: "whatsapp",
            });
            for (const reply of result.replies) {
              await sendWhatsAppText(msg.from, reply);
            }
          } catch (err) {
            console.error("[whatsapp] handler failed", err);
          }
        }
        return new Response("EVENT_RECEIVED", { status: 200 });
      },
    },
  },
});
