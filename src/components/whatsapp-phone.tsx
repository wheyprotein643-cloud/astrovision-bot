import { useEffect, useRef, useState } from "react";
import { CheckCheck, Send } from "lucide-react";
import { WaText } from "@/components/wa-text";
import { cn } from "@/lib/utils";

export type ChatMsg = {
  id: string;
  from: "them" | "me";
  text: string;
  at: string;
};

const QUICK = [
  "Namaste",
  "Kundli",
  "Shaadi kab hogi",
  "Neelam",
  "Address",
  "Appointment",
];

export function WhatsAppPhone({
  messages,
  typing,
  onSend,
  disabled,
}: {
  messages: ChatMsg[];
  typing: boolean;
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function submit(text: string) {
    const next = text.trim();
    if (!next || disabled) return;
    onSend(next);
    setDraft("");
  }

  return (
    <div className="wa-phone mx-auto flex h-[min(640px,calc(100dvh-2.5rem))] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] border border-border bg-wa-chat shadow-phone lg:h-[min(640px,calc(100dvh-5rem))]">
      <header className="flex shrink-0 items-center gap-3 bg-wa-header px-3 py-2.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-elevated">
          <svg viewBox="0 0 32 32" className="size-5 text-accent" aria-hidden>
            <path
              fill="currentColor"
              d="M18.2 6.2c-5.1 1-8.8 5.6-8.8 10.9 0 1.4.3 2.8.8 4.1C7.8 19.7 6 16.6 6 13.1 6 7.6 10.6 3.2 16.2 3.2c2.3 0 4.5.8 6.2 2.2-.5.2-2.8.5-4.2.8Z"
            />
            <path fill="currentColor" d="M22.4 8.4 24 6.2l.6 2.6 2.6.2-2.2 1.6.8 2.6-2.2-1.5-2.2 1.5.8-2.6-2.2-1.6 2.6-.2Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[15px] font-medium leading-tight text-fg">
            Astro-Vision
          </p>
          <p className="truncate text-[11px] text-wa-meta">
            {typing ? "typing…" : "Pandit Harvinder Singh Dhillon · Ludhiana"}
          </p>
        </div>
      </header>

      <div
        ref={scroller}
        className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgb(255 255 255 / 0.03), transparent 40%), radial-gradient(circle at 80% 90%, rgb(255 255 255 / 0.025), transparent 45%)",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("mb-1.5 flex", m.from === "me" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[86%] rounded-md px-2.5 py-1.5 text-[13.5px] leading-relaxed text-fg",
                m.from === "me" ? "rounded-tr-sm bg-wa-out" : "rounded-tl-sm bg-wa-in",
              )}
            >
              <WaText text={m.text} />
              <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-wa-meta">
                {m.at}
                {m.from === "me" ? <CheckCheck className="size-3.5 text-wa-tick" /> : null}
              </span>
            </div>
          </div>
        ))}
        {typing ? (
          <div className="mb-1.5 flex justify-start">
            <div className="rounded-md rounded-tl-sm bg-wa-in px-3 py-2 text-wa-meta">
              <span className="inline-flex gap-1">
                <i className="inline-block size-1.5 animate-pulse rounded-full bg-wa-meta" />
                <i className="inline-block size-1.5 animate-pulse rounded-full bg-wa-meta [animation-delay:120ms]" />
                <i className="inline-block size-1.5 animate-pulse rounded-full bg-wa-meta [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-black/20 bg-wa-bar px-2 py-2">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled || typing}
            onClick={() => submit(q)}
            className="rounded-full border border-border bg-wa-in px-2.5 py-1 text-[11px] text-fg/90 hover:bg-elevated disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className="flex shrink-0 items-center gap-2 bg-wa-bar px-2 pb-3 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <label className="sr-only" htmlFor="wa-draft">
          Message
        </label>
        <input
          id="wa-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-full border border-border bg-wa-in px-4 text-sm text-fg placeholder:text-wa-meta focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={disabled || typing || !draft.trim()}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-wa-out text-fg disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
