import type { Lang, ServiceId } from "./catalog";

export type BookingStep =
  | "ask_name"
  | "ask_dob"
  | "ask_tob"
  | "ask_pob"
  | "ask_concern"
  | "confirm";

export type AwaitFlag = "none" | "book_confirm";

export type BookingDraft = {
  name?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  concern?: string;
};

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type BotSession = {
  id: string;
  lang: Lang;
  await: AwaitFlag;
  bookingStep: BookingStep | null;
  booking: BookingDraft;
  lastService?: ServiceId;
  history: ChatTurn[];
  profileName?: string;
  phone?: string;
  updatedAt: number;
};

const sessions = new Map<string, BotSession>();
const TTL_MS = 1000 * 60 * 60 * 24;

export type Lead = {
  id: string;
  at: number;
  channel: "whatsapp" | "web";
  phone?: string;
  profileName?: string;
  booking: BookingDraft;
  lang: Lang;
};

const leads: Lead[] = [];
const MAX_LEADS = 80;

function pruneSessions() {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.updatedAt > TTL_MS) sessions.delete(id);
  }
}

export function getSession(id: string): BotSession {
  pruneSessions();
  const existing = sessions.get(id);
  if (existing) return existing;
  const fresh: BotSession = {
    id,
    lang: "hi",
    await: "none",
    bookingStep: null,
    booking: {},
    history: [],
    updatedAt: Date.now(),
  };
  sessions.set(id, fresh);
  return fresh;
}

export function touch(session: BotSession) {
  session.updatedAt = Date.now();
  sessions.set(session.id, session);
}

export function resetFlow(session: BotSession) {
  session.await = "none";
  session.bookingStep = null;
  session.booking = {};
  touch(session);
}

export function pushHistory(session: BotSession, role: ChatTurn["role"], text: string) {
  session.history.push({ role, text });
  if (session.history.length > 16) {
    session.history = session.history.slice(-16);
  }
  touch(session);
}

export function addLead(lead: Omit<Lead, "id" | "at">): Lead {
  const row: Lead = {
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: Date.now(),
  };
  leads.unshift(row);
  if (leads.length > MAX_LEADS) leads.length = MAX_LEADS;
  return row;
}

export function listLeads(): Lead[] {
  return leads.slice(0, 40);
}

const processedIds = new Set<string>();

export function markProcessed(id: string): boolean {
  if (processedIds.has(id)) return false;
  processedIds.add(id);
  if (processedIds.size > 800) {
    const first = processedIds.values().next().value;
    if (first) processedIds.delete(first);
  }
  return true;
}
