import http from "node:http";
import { handleIncoming } from "../src/lib/bot/engine";
import { markProcessed } from "../src/lib/bot/session";
import {
  parseWhatsAppPayload,
  sendWhatsAppText,
  verifyWebhookChallenge,
  whatsappConfigured,
} from "../src/lib/bot/whatsapp";
import { createHmac, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT ?? 8080);

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

async function readBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function send(res: http.ServerResponse, status: number, body: string, type = "text/plain") {
  res.writeHead(status, { "content-type": `${type}; charset=utf-8` });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if ((path === "/health" || path === "/api/health") && req.method === "GET") {
    send(
      res,
      200,
      JSON.stringify({
        ok: true,
        service: "astro-vision-bot",
        whatsapp: whatsappConfigured(),
      }),
      "application/json",
    );
    return;
  }

  if ((path === "/webhook" || path === "/api/whatsapp/webhook") && req.method === "GET") {
    const challenge = verifyWebhookChallenge(url);
    if (challenge) {
      send(res, 200, challenge);
      return;
    }
    send(res, 403, "Forbidden");
    return;
  }

  if ((path === "/webhook" || path === "/api/whatsapp/webhook") && req.method === "POST") {
    const raw = await readBody(req);
    const header = String(req.headers["x-hub-signature-256"] ?? "");
    if (!signatureOk(raw, header || null)) {
      send(res, 401, "Invalid signature");
      return;
    }
    let payload: unknown;
    try {
      payload = JSON.parse(raw) as unknown;
    } catch {
      send(res, 400, "Bad JSON");
      return;
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
    send(res, 200, "EVENT_RECEIVED");
    return;
  }

  if (path === "/" && req.method === "GET") {
    send(
      res,
      200,
      JSON.stringify({
        name: "Astro-Vision WhatsApp bot",
        webhook: "/webhook",
        health: "/health",
      }),
      "application/json",
    );
    return;
  }

  send(res, 404, "Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Astro-Vision bot listening on ${PORT}`);
});
