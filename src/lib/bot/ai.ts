import { BUSINESS, MENU_ITEMS, phonesLine, type Lang } from "./catalog";
import type { BotSession } from "./session";

const SYSTEM = (lang: Lang) =>
  `You are the WhatsApp receptionist for ${BUSINESS.legal} in ${BUSINESS.city}, Punjab.
Astrologer: Pandit ${BUSINESS.astrologer}. Established ${BUSINESS.since}.
Phones: ${phonesLine()}. Email: ${BUSINESS.email}.
Address: ${BUSINESS.address}.

Services: ${MENU_ITEMS.map((i) => tSafe(i.title, lang)).join("; ")}.

Rules:
- Reply in ${lang === "hi" ? "simple Hindi (Devanagari or clear Hinglish is fine; prefer Hinglish if the user used Roman Hindi)" : "clear English"}.
- You are a receptionist, not inventing a full personal prediction. If they want a personal reading, ask for name, date, time, place of birth and offer an appointment.
- Never invent prices, discounts, or medical/legal guarantees. Fees depend on the case and are shared at booking.
- Never claim visa, pregnancy, disease cure or lottery as certain.
- Keep replies under 90 words. WhatsApp style. Short paragraphs. No emoji except at most one.
- End with a next step: menu number, "haan" to book, or the phone number.
- Do not mention that you are an AI or Grok.`;

function tSafe(copy: { hi: string; en: string }, lang: Lang) {
  return copy[lang];
}

export async function answerWithGrok(
  session: BotSession,
  text: string,
  lang: Lang,
): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM(lang) },
  ];
  for (const turn of session.history.slice(-8)) {
    messages.push({
      role: turn.role === "user" ? "user" : "assistant",
      content: turn.text.slice(0, 800),
    });
  }
  messages.push({ role: "user", content: text.slice(0, 800) });

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages,
        max_tokens: 280,
        temperature: 0.4,
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const textOut = body.choices?.[0]?.message?.content?.trim();
    return textOut || null;
  } catch {
    return null;
  }
}
