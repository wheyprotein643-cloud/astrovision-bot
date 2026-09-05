import {
  BUSINESS,
  GEMSTONES,
  MENU_ITEMS,
  RASHIS,
  SERVICES,
  contactMessage,
  phonesLine,
  t,
  welcomeMessage,
  type Lang,
  type ServiceId,
} from "./catalog";
import { answerWithGrok } from "./ai";
import {
  addLead,
  getSession,
  pushHistory,
  resetFlow,
  touch,
  type BotSession,
} from "./session";

export type Incoming = {
  userId: string;
  text: string;
  profileName?: string;
  phone?: string;
  channel: "whatsapp" | "web";
};

export type BotResult = {
  replies: string[];
  lang: Lang;
  leadCaptured: boolean;
};

const GREETING =
  /\b(hi|hii|hello|hey|yo|namaste|namaskar|sat sri akal|ssa|good morning|good evening|good afternoon|start|begin|menu|help|madad|shuru)\b/i;

const YES = /^(haan|han|ha|ji|yes|y|ok|okay|sure|theek|thik|book|appointment|karo|kar do|ho jao)\b/i;
const NO = /^(nahi|na|no|mat|baad|later|nahin)\b/i;
const MENU_CMD = /^(menu|start|help|seva|services|options|list)$/i;
const BYE = /\b(bye|goodbye|thanks|thank you|dhanyavad|dhanyavaad|shukriya|ok thanks)\b/i;

function normalize(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function detectLang(text: string, prev: Lang): Lang {
  if (/[\u0900-\u097F\u0A00-\u0A7F]/.test(text)) return "hi";
  if (
    /\b(hai|hain|kya|kyun|kab|kaise|chahiye|chahie|mujhe|mera|meri|aap|ji|nahi|nahin|haan|han|shaadi|shadi|kundli|kundali|naukri|videsh|sehat|batao|bataye|karna|karo|namaste|namaskar|theek|thik|pata|kitna|seva|janam|milan|ratna|neelam|pukhraj)\b/i.test(
      text,
    )
  ) {
    return "hi";
  }
  if (
    /\b(what|when|will|would|should|please|could|this|that|appointment|marriage|horoscope|hello|thanks|thank|yes|okay|where|how)\b/i.test(
      text,
    )
  ) {
    return "en";
  }
  return prev;
}

function menuText(lang: Lang): string {
  return welcomeMessage(lang);
}

function contactText(lang: Lang): string {
  return contactMessage(lang);
}

function feesText(lang: Lang): string {
  return lang === "hi"
    ? `Consultation fees janam kundli aur sawal par depend karti hai. Exact amount appointment par bata diya jayega.\n\nCall: ${phonesLine()}\nBooking ke liye 17 bhejein.`
    : `Consultation fees depend on the chart and the question. Exact amount is shared when you book.\n\nCall: ${phonesLine()}\nSend 17 to book.`;
}

function gemstoneDetail(
  keysHit: (typeof GEMSTONES)[number],
  lang: Lang,
): string {
  if (lang === "hi") {
    return [
      `*${t(keysHit.name, lang)}*`,
      `Grah: ${t(keysHit.planet, lang)}`,
      `Ungli: ${t(keysHit.finger, lang)}`,
      `Din: ${t(keysHit.day, lang)}`,
      `Dhatu: ${t(keysHit.metal, lang)}`,
      ``,
      `Yeh general niyam hai. Aapki kundli ke hisaab se pathar badal sakta hai — galat ratna nuksaan kare.`,
      `Personal salah ke liye "Haan" likhein.`,
    ].join("\n");
  }
  return [
    `*${t(keysHit.name, lang)}*`,
    `Planet: ${t(keysHit.planet, lang)}`,
    `Finger: ${t(keysHit.finger, lang)}`,
    `Day: ${t(keysHit.day, lang)}`,
    `Metal: ${t(keysHit.metal, lang)}`,
    ``,
    `These are general rules. The right stone depends on your chart — a wrong gem can harm.`,
    `Reply Yes for a personal recommendation.`,
  ].join("\n");
}

function hashDay(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function rashiNote(name: { hi: string; en: string }, lang: Lang): string {
  const day = new Date().toISOString().slice(0, 10);
  const themesHi = [
    "aaj sabr aur soch-samajh se kaam len. Jaldbazi se bachhein.",
    "parivar aur ghar ke mamle mein madad mil sakti hai. Bolne se pehle sochhein.",
    "kaam-kaaj mein naya rasta dikh sakta hai. Health ka khayal rakhein.",
    "old pending kaam poora karne ka din. Kharch control mein rakhein.",
    "rishte aur baat-cheet shubh. Misunderstanding clear karein.",
    "apaat kal ke liye planning achhi. Travel ho to extra time nikal ke niklein.",
  ];
  const themesEn = [
    "patience pays today. Avoid rushing a decision.",
    "home and family may ask for attention. Think before you speak.",
    "work may show a new opening. Guard your health.",
    "a good day to close old tasks. Keep spending in check.",
    "conversations go well. Clear any misunderstanding.",
    "plan ahead. If you travel, leave extra time.",
  ];
  const idx = hashDay(`${day}-${name.en}`) % themesHi.length;
  const disclaimer =
    lang === "hi"
      ? `Yeh saadharan daily note hai. Personal kundli alag hoti hai.`
      : `This is a general daily note. Your personal chart is different.`;
  if (lang === "hi") {
    return `*${name.hi} — aaj*\n${themesHi[idx]}\n\n${disclaimer}\nApni kundli ke liye 1 ya 17 bhejein.`;
  }
  return `*${name.en} — today*\n${themesEn[idx]}\n\n${disclaimer}\nSend 1 or 17 for a personal chart.`;
}

function findService(q: string): ServiceId | null {
  const lower = q.toLowerCase();
  let best: { id: ServiceId; score: number } | null = null;
  for (const [id, svc] of Object.entries(SERVICES) as [ServiceId, (typeof SERVICES)[ServiceId]][]) {
    for (const kw of svc.keywords) {
      if (lower.includes(kw)) {
        const score = kw.length;
        if (!best || score > best.score) best = { id, score };
      }
    }
  }
  return best?.id ?? null;
}

function findGem(q: string) {
  const lower = q.toLowerCase();
  return GEMSTONES.find((g) => g.keys.some((k) => lower.includes(k)));
}

function findRashi(q: string) {
  const lower = q.toLowerCase();
  return RASHIS.find((r) => r.keys.some((k) => lower.includes(k)));
}

function menuByNumber(n: number) {
  return MENU_ITEMS.find((i) => i.num === n);
}

function looksLikeDob(text: string): boolean {
  return (
    /\b\d{1,2}[\/\-.\s]\d{1,2}[\/\-.\s]\d{2,4}\b/.test(text) ||
    /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|janvari|farvari|march|april|mai|jun|julai|agast|sitambar|aktubar|navambar|disambar)\w*\s+\d{2,4}\b/i.test(
      text,
    )
  );
}

function startBooking(session: BotSession, lang: Lang): string {
  session.bookingStep = "ask_name";
  session.await = "none";
  session.booking = session.booking ?? {};
  touch(session);
  return lang === "hi"
    ? `Theek hai. Appointment ke liye 5 baatein chahiye.\n\n1/5 — Aapka *poora naam*?`
    : `Good. I need five details for the appointment.\n\n1/5 — Your *full name*?`;
}

function bookingPrompt(step: NonNullable<BotSession["bookingStep"]>, lang: Lang): string {
  const hi: Record<string, string> = {
    ask_name: `1/5 — Aapka *poora naam*?`,
    ask_dob: `2/5 — *Janam tithi* (jaise 12/03/1990)?`,
    ask_tob: `3/5 — *Janam samay* (jaise 4:20 AM). Agar exact nahi pata to "nahi pata" likhein.`,
    ask_pob: `4/5 — *Janam sthan* (sheher / gaon)?`,
    ask_concern: `5/5 — Kis vishay par salah chahiye (shaadi, naukri, ratna…)?`,
    confirm: `Yeh details theek hain? "Haan" bhejein confirm karne ke liye, ya galat cheez dobara likhein.`,
  };
  const en: Record<string, string> = {
    ask_name: `1/5 — Your *full name*?`,
    ask_dob: `2/5 — *Date of birth* (e.g. 12/03/1990)?`,
    ask_tob: `3/5 — *Time of birth* (e.g. 4:20 AM). If unknown, type "not sure".`,
    ask_pob: `4/5 — *Place of birth* (city / village)?`,
    ask_concern: `5/5 — What should we focus on (marriage, career, gem…)?`,
    confirm: `Do these details look right? Reply Yes to confirm, or resend the correction.`,
  };
  return (lang === "hi" ? hi : en)[step] ?? "";
}

function summarizeBooking(session: BotSession, lang: Lang): string {
  const b = session.booking;
  const rows =
    lang === "hi"
      ? [
          `Naam: ${b.name ?? "—"}`,
          `Janam tithi: ${b.dob ?? "—"}`,
          `Samay: ${b.tob ?? "—"}`,
          `Sthan: ${b.pob ?? "—"}`,
          `Vishay: ${b.concern ?? "—"}`,
        ]
      : [
          `Name: ${b.name ?? "—"}`,
          `Date of birth: ${b.dob ?? "—"}`,
          `Time: ${b.tob ?? "—"}`,
          `Place: ${b.pob ?? "—"}`,
          `Topic: ${b.concern ?? "—"}`,
        ];
  return rows.join("\n");
}

function confirmLead(
  session: BotSession,
  incoming: Incoming,
  lang: Lang,
): string {
  addLead({
    channel: incoming.channel,
    phone: incoming.phone ?? session.phone,
    profileName: incoming.profileName ?? session.profileName,
    booking: { ...session.booking },
    lang,
  });
  resetFlow(session);
  if (lang === "hi") {
    return [
      `Dhanyavaad. Aapki appointment request *Astro-Vision* ke paas aa gayi hai.`,
      ``,
      `Pandit ${BUSINESS.astrologer} ji jald call / WhatsApp karenge.`,
      ``,
      `Phone: ${phonesLine()}`,
      `Pata: ${BUSINESS.address}`,
      ``,
      `Koi aur seva? Menu ke liye "menu" likhein.`,
    ].join("\n");
  }
  return [
    `Thank you. Your appointment request is with *Astro-Vision*.`,
    ``,
    `Pandit ${BUSINESS.astrologer} will call or WhatsApp you shortly.`,
    ``,
    `Phone: ${phonesLine()}`,
    `Address: ${BUSINESS.address}`,
    ``,
    `Anything else? Type menu.`,
  ].join("\n");
}

function handleBooking(
  session: BotSession,
  text: string,
  incoming: Incoming,
  lang: Lang,
): string | null {
  if (!session.bookingStep) return null;

  if (MENU_CMD.test(text) || /^(cancel|band|ruk|stop)$/i.test(text)) {
    resetFlow(session);
    return menuText(lang);
  }

  const step = session.bookingStep;
  if (step === "ask_name") {
    session.booking.name = text;
    session.bookingStep = "ask_dob";
  } else if (step === "ask_dob") {
    session.booking.dob = text;
    session.bookingStep = "ask_tob";
  } else if (step === "ask_tob") {
    session.booking.tob = text;
    session.bookingStep = "ask_pob";
  } else if (step === "ask_pob") {
    session.booking.pob = text;
    session.bookingStep = "ask_concern";
  } else if (step === "ask_concern") {
    session.booking.concern = text;
    session.bookingStep = "confirm";
    touch(session);
    return (
      (lang === "hi" ? `Details:\n` : `Details:\n`) +
      summarizeBooking(session, lang) +
      `\n\n` +
      bookingPrompt("confirm", lang)
    );
  } else if (step === "confirm") {
    if (YES.test(text) || /confirm|theek|sahi/.test(text.toLowerCase())) {
      return confirmLead(session, incoming, lang);
    }
    if (NO.test(text)) {
      session.bookingStep = "ask_name";
      session.booking = {};
      return lang === "hi"
        ? `Theek, dobara shuru karte hain.\n\n` + bookingPrompt("ask_name", lang)
        : `Alright, let's start over.\n\n` + bookingPrompt("ask_name", lang);
    }
    session.booking.concern = `${session.booking.concern ?? ""} | ${text}`.trim();
    return (
      summarizeBooking(session, lang) +
      `\n\n` +
      bookingPrompt("confirm", lang)
    );
  }
  touch(session);
  return bookingPrompt(session.bookingStep, lang);
}

function serviceReply(id: ServiceId, lang: Lang, session: BotSession): string {
  session.lastService = id;
  session.await = "book_confirm";
  touch(session);
  return t(SERVICES[id].reply, lang);
}

export async function handleIncoming(incoming: Incoming): Promise<BotResult> {
  const text = normalize(incoming.text);
  const session = getSession(incoming.userId);
  if (incoming.profileName) session.profileName = incoming.profileName;
  if (incoming.phone) session.phone = incoming.phone;

  if (!text) {
    const lang = session.lang;
    return {
      replies: [
        lang === "hi"
          ? `Kuch likhein — jaise "menu", "kundli", ya 17 appointment ke liye.`
          : `Please type something — "menu", "kundli", or 17 to book.`,
      ],
      lang,
      leadCaptured: false,
    };
  }

  if (!session.bookingStep) {
    session.lang = detectLang(text, session.lang);
  }
  const lang = session.lang;
  pushHistory(session, "user", text);

  const finish = (msgs: string[], captured = false): BotResult => {
    for (const m of msgs) pushHistory(session, "assistant", m);
    return { replies: msgs, lang, leadCaptured: captured };
  };

  if (session.bookingStep) {
    const msg = handleBooking(session, text, incoming, lang);
    if (msg) {
      const captured =
        msg.includes("appointment request") || msg.includes("aa gayi hai");
      return finish([msg], captured);
    }
  }

  if (MENU_CMD.test(text) || GREETING.test(text)) {
    resetFlow(session);
    return finish([menuText(lang)]);
  }

  if (session.await === "book_confirm" && YES.test(text)) {
    return finish([startBooking(session, lang)]);
  }
  if (session.await === "book_confirm" && NO.test(text)) {
    session.await = "none";
    return finish([
      lang === "hi"
        ? `Theek hai. Aur kuch poochna ho to likhein, ya "menu" bhejein.`
        : `Alright. Ask anything else, or type menu.`,
    ]);
  }

  const asNum = Number.parseInt(text, 10);
  if (/^\d{1,2}$/.test(text) && asNum >= 1 && asNum <= 18) {
    const item = menuByNumber(asNum);
    if (!item) {
      /* fall through */
    } else if (item.id === "book") {
      return finish([startBooking(session, lang)]);
    } else if (item.id === "contact") {
      return finish([contactText(lang)]);
    } else {
      return finish([serviceReply(item.id, lang, session)]);
    }
  }

  if (
    /\b(address|pata|location|kahan|kidhar|contact|phone|email|map)\b/i.test(
      text,
    )
  ) {
    return finish([contactText(lang)]);
  }

  if (/\b(fees|fee|price|charge|rate|kitna|kharcha|cost|payment)\b/i.test(text)) {
    session.await = "book_confirm";
    return finish([feesText(lang)]);
  }

  if (
    /\b(appointment|book|booking|slot|milna|time nikal|consult)\b/i.test(text)
  ) {
    return finish([startBooking(session, lang)]);
  }

  const gem = findGem(text);
  if (gem) {
    session.await = "book_confirm";
    session.lastService = "gemstone";
    return finish([gemstoneDetail(gem, lang)]);
  }

  const rashi = findRashi(text);
  if (rashi) {
    const askedDaily =
      /\b(aaj|today|daily|rashifal|horoscope|rashi|zodiac)\b/i.test(text) ||
      text.split(/\s+/).length <= 3;
    if (askedDaily) {
      session.await = "book_confirm";
      return finish([rashiNote(rashi.name, lang)]);
    }
  }

  const svc = findService(text);
  if (svc) {
    return finish([serviceReply(svc, lang, session)]);
  }

  if (looksLikeDob(text)) {
    session.booking.dob = text;
    session.bookingStep = "ask_name";
    return finish([
      lang === "hi"
        ? `Janam tithi note ho gayi.\n\nAppointment poori karne ke liye naam bhejein.`
        : `Date of birth noted.\n\nSend your name to continue the appointment.`,
    ]);
  }

  if (BYE.test(text) && text.split(/\s+/).length <= 4) {
    return finish([
      lang === "hi"
        ? `Namaste ji. Zarurat ho to fir message karein.\n${phonesLine()}`
        : `Namaste. Message again whenever you need.\n${phonesLine()}`,
    ]);
  }

  const ai = await answerWithGrok(session, text, lang);
  if (ai) {
    session.await = "book_confirm";
    return finish([ai]);
  }

  return finish([
    lang === "hi"
      ? `Maaf kijiye, yeh sawal menu se match nahi hua.\n\n"menu" likhein, ya seedha 1–18 mein se number bhejein.\nCall: ${phonesLine()}`
      : `Sorry, I didn't catch that.\n\nType menu, or send a number from 1–18.\nCall: ${phonesLine()}`,
  ]);
}

export function previewWelcome(lang: Lang): string {
  return menuText(lang);
}
