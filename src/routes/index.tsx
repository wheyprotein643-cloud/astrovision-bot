import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { WhatsAppPhone, type ChatMsg } from "@/components/whatsapp-phone";
import { sendBotMessage, getBotStatus, getLeads } from "@/lib/bot/actions";
import {
  BUSINESS,
  MENU_ITEMS,
  SERVICES,
  welcomeMessage,
  type ServiceId,
} from "@/lib/bot/catalog";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/bot/session";

export const Route = createFileRoute("/")({ component: Home });

function nowStamp() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function Home() {
  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `sess-${Date.now()}`;
  }, []);

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: "welcome",
      from: "them",
      text: welcomeMessage("hi"),
      at: nowStamp(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [tab, setTab] = useState<"how" | "services" | "deploy">("how");
  const [status, setStatus] = useState({ whatsapp: false, ai: false, verifyTokenSet: false });
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    void getBotStatus().then(setStatus).catch(() => undefined);
    void getLeads().then(setLeads).catch(() => undefined);
  }, []);

  async function onSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: newId(), from: "me", text, at: nowStamp() },
    ]);
    setTyping(true);
    try {
      const result = await sendBotMessage({ data: { sessionId, text } });
      const replies = result.replies.map((r) => ({
        id: newId(),
        from: "them" as const,
        text: r,
        at: nowStamp(),
      }));
      setMessages((prev) => [...prev, ...replies]);
      if (result.leadCaptured) {
        const next = await getLeads();
        setLeads(next);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          from: "them",
          text: "Network issue. Thodi der baad try karein, ya call karein " + BUSINESS.phones[0],
          at: nowStamp(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bg">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-6 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-8 lg:py-10">
        <div className="lg:sticky lg:top-6">
          <WhatsAppPhone messages={messages} typing={typing} onSend={onSend} />
        </div>

        <section className="flex min-w-0 flex-col gap-8 pb-10">
          <header className="space-y-4">
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              Since {BUSINESS.since} · {BUSINESS.city}
            </p>
            <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
              Astro-Vision
              <span className="mt-2 block text-[0.55em] font-normal tracking-normal text-muted">
                WhatsApp Jyotish bot
              </span>
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted">
              Customer message bhejta hai — bot turant Hindi ya English mein
              jawab deta hai: meri sevayein, ratna, pata, aur appointment.
              Left par pehle khud try karein.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <StatusChip ok={status.whatsapp} label="WhatsApp API" />
              <StatusChip ok={status.ai} label="Smart replies" />
              <StatusChip ok label="Menu + booking" />
            </div>
          </header>

          <div className="flex gap-1 rounded-xl bg-surface p-1">
            {(
              [
                ["how", "Kaise kaam karega"],
                ["services", "Sevayein"],
                ["deploy", "Railway"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                  tab === id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "how" ? <HowPanel leads={leads} /> : null}
          {tab === "services" ? <ServicesPanel onTry={onSend} /> : null}
          {tab === "deploy" ? <DeployPanel /> : null}
        </section>
      </div>
    </main>
  );
}

function StatusChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1">
      <span
        className={cn(
          "size-1.5 rounded-full",
          ok ? "bg-accent" : "bg-subtle",
        )}
      />
      {label}
    </span>
  );
}

function HowPanel({ leads }: { leads: Lead[] }) {
  const steps = [
    {
      icon: MessageCircle,
      title: "Customer WhatsApp karta hai",
      body: "Namaste, hi, ya koi sawal. Bot language pehchaan leta hai — Hindi, Hinglish, English.",
    },
    {
      icon: Waypoints,
      title: "Menu ya seedha jawab",
      body: "Number 1–18 se seva, ya seedha “shaadi kab hogi”, “neelam”, “address”. Open sawal par smart reply.",
    },
    {
      icon: Clock3,
      title: "Appointment 5 steps",
      body: "Naam, janam tithi, samay, sthan, vishay. Confirm par lead save — aapko call karni hai.",
    },
  ];

  const samples = [
    { q: "Namaste", a: "Welcome + 18-point menu (Kundli se Reiki, book, pata)." },
    { q: "2  ya  Kundli Milan", a: "Ashtakoot / Mangal dosh ki explanation + book CTA." },
    { q: "Neelam", a: "Shani, middle finger, Saturday, metal — phir personal salah offer." },
    { q: "Mesh", a: "Aaj ka general rashifal + personal kundli ke liye 1 ya 17." },
    { q: "Kitna charge", a: "Fees case par depend — exact amount booking par." },
    { q: "17 / Haan", a: "5-step booking, confirm ke baad phone + Ludhiana address." },
  ];

  return (
    <div className="space-y-8">
      <ol className="grid gap-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-accent">
              <s.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-fg">
                {i + 1}. {s.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div>
        <h2 className="font-display text-xl text-fg">Kya reply dega</h2>
        <p className="mt-1 text-sm text-muted">
          Phone par chips dabao, ya yeh examples type karo.
        </p>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {samples.map((row) => (
            <li key={row.q} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
              <p className="font-medium text-fg">{row.q}</p>
              <p className="text-sm text-muted">{row.a}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="text-sm font-medium text-fg">Is session ki bookings</h3>
        {leads.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Abhi koi lead nahi. Phone par 17 bhejkar flow poora karke dekho.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {leads.map((l) => (
              <li key={l.id} className="rounded-lg bg-elevated px-3 py-2 text-sm">
                <p className="font-medium text-fg">{l.booking.name ?? "—"}</p>
                <p className="text-muted">
                  {l.booking.dob ?? "—"} · {l.booking.pob ?? "—"} · {l.booking.concern ?? "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ServicesPanel({ onTry }: { onTry: (q: string) => void }) {
  const ids = Object.keys(SERVICES) as ServiceId[];
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">
        Pandit {BUSINESS.astrologer} — {BUSINESS.legal}. Har card dabane se
        WhatsApp par wahi reply chalta hai jo customer ko milega.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ids.map((id) => {
          const svc = SERVICES[id];
          const num = MENU_ITEMS.find((m) => m.id === id)?.num;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onTry(String(num ?? svc.title.hi))}
                className="flex h-full w-full flex-col rounded-2xl border border-border bg-surface p-4 text-left hover:bg-elevated"
              >
                <span className="text-[11px] tracking-wide text-muted tabular-nums">
                  {num?.toString().padStart(2, "0")}
                </span>
                <span className="mt-1 font-medium text-fg">{svc.title.hi}</span>
                <span className="mt-1 line-clamp-2 text-sm text-muted">{svc.title.en}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
        <p className="flex items-center gap-2 text-fg">
          <Phone className="size-4 text-accent" />
          {BUSINESS.phones.join("  ·  ")}
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="size-4 shrink-0 text-accent" />
          {BUSINESS.address}
        </p>
      </div>
    </div>
  );
}

function DeployPanel() {
  return (
    <div className="space-y-5 text-sm leading-relaxed text-muted">
      <p>
        WhatsApp API aapke paas ready hai. Bot webhook{" "}
        <span className="text-fg">/api/whatsapp/webhook</span> par sunta hai.
        GitHub se Railway par yeh values set karni hain:
      </p>
      <ul className="space-y-2 rounded-2xl border border-border bg-surface p-4 font-mono text-[12.5px] text-fg">
        <li>WHATSAPP_TOKEN</li>
        <li>WHATSAPP_PHONE_NUMBER_ID</li>
        <li>WHATSAPP_VERIFY_TOKEN</li>
        <li>WHATSAPP_APP_SECRET</li>
      </ul>
      <ol className="space-y-3">
        <li className="rounded-2xl border border-border bg-surface p-4">
          <p className="font-medium text-fg">1. Code GitHub par</p>
          <p className="mt-1">
            Ye project Railway ke liye ready hai — start command bot server
            chalata hai.
          </p>
        </li>
        <li className="rounded-2xl border border-border bg-surface p-4">
          <p className="font-medium text-fg">2. Railway New Project → GitHub</p>
          <p className="mt-1">
            Repo connect karo. Upar wale env vars add karo. Deploy ke baad
            public HTTPS URL milegi.
          </p>
        </li>
        <li className="rounded-2xl border border-border bg-surface p-4">
          <p className="font-medium text-fg">3. Meta webhook</p>
          <p className="mt-1">
            Callback URL:{" "}
            <span className="text-fg">https://YOUR-RAILWAY-HOST/webhook</span>
            <br />
            Verify token: jo WHATSAPP_VERIFY_TOKEN mein rakha.
            <br />
            Subscribe: messages.
          </p>
        </li>
      </ol>
      <p className="flex items-start gap-2">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
        Preview yahan bina WhatsApp ke chal raha hai. Live number tab chalu
        hoga jab webhook Meta se jud jayega.
      </p>
    </div>
  );
}
