const GRAPH = "https://graph.facebook.com/v21.0";

export function whatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    throw new Error("WhatsApp is not configured");
  }
  const chunks = splitWhatsApp(body);
  for (const text of chunks) {
    const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body: text },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`WhatsApp send failed ${res.status}: ${err.slice(0, 400)}`);
    }
  }
}

export function splitWhatsApp(body: string, limit = 3900): string[] {
  if (body.length <= limit) return [body];
  const parts: string[] = [];
  let rest = body;
  while (rest.length > limit) {
    let cut = rest.lastIndexOf("\n", limit);
    if (cut < limit * 0.5) cut = limit;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

export type WaIncomingMessage = {
  from: string;
  id: string;
  text: string;
  name?: string;
};

type WaChange = {
  value?: {
    contacts?: { profile?: { name?: string }; wa_id?: string }[];
    messages?: {
      from: string;
      id: string;
      type?: string;
      text?: { body?: string };
      button?: { text?: string };
      interactive?: {
        button_reply?: { title?: string };
        list_reply?: { title?: string };
      };
    }[];
    statuses?: unknown[];
  };
};

export function parseWhatsAppPayload(payload: unknown): WaIncomingMessage[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as {
    object?: string;
    entry?: { changes?: WaChange[] }[];
  };
  const out: WaIncomingMessage[] = [];
  for (const entry of obj.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value?.messages) continue;
      const name = value.contacts?.[0]?.profile?.name;
      for (const msg of value.messages) {
        const text =
          msg.text?.body ??
          msg.button?.text ??
          msg.interactive?.button_reply?.title ??
          msg.interactive?.list_reply?.title ??
          "";
        if (!text) continue;
        out.push({ from: msg.from, id: msg.id, text, name });
      }
    }
  }
  return out;
}

export function verifyWebhookChallenge(url: URL): string | null {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN ?? "astrovision-verify";
  if (mode === "subscribe" && token === expected && challenge) return challenge;
  return null;
}
