/**
 * Caderno de Margem: estado não secreto da sessão local de agente.
 * A API key nunca integra este objeto; o componente a conserva apenas em memória.
 */
export const SESSION_IDLE_MS = 20 * 60 * 1_000;

export type AgentSessionStatus = "closed" | "open" | "expired";

export type AgentSession = {
  status: AgentSessionStatus;
  openedAt: number | null;
  lastActivityAt: number | null;
  expiresAt: number | null;
};

export const CLOSED_SESSION: AgentSession = {
  status: "closed",
  openedAt: null,
  lastActivityAt: null,
  expiresAt: null,
};

export function canOpenSession(apiKey: string) {
  return apiKey.trim().length >= 12;
}

export function openSession(apiKey: string, now = Date.now()): AgentSession | null {
  if (!canOpenSession(apiKey)) return null;
  return { status: "open", openedAt: now, lastActivityAt: now, expiresAt: now + SESSION_IDLE_MS };
}

export function noteSessionActivity(session: AgentSession, now = Date.now()): AgentSession {
  if (session.status !== "open") return session;
  return { ...session, lastActivityAt: now, expiresAt: now + SESSION_IDLE_MS };
}

export function expireSessionIfNeeded(session: AgentSession, now = Date.now()): AgentSession {
  if (session.status !== "open" || !session.expiresAt || now < session.expiresAt) return session;
  return { status: "expired", openedAt: session.openedAt, lastActivityAt: session.lastActivityAt, expiresAt: session.expiresAt };
}

export function secondsUntilExpiration(session: AgentSession, now = Date.now()) {
  if (session.status !== "open" || !session.expiresAt) return 0;
  return Math.max(0, Math.ceil((session.expiresAt - now) / 1_000));
}
