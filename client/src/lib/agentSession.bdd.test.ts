/**
 * Caderno de Margem: cenários BDD para a vida curta da credencial de agente.
 */
import { describe, expect, it } from "vitest";
import {
  CLOSED_SESSION,
  SESSION_IDLE_MS,
  expireSessionIfNeeded,
  noteSessionActivity,
  openSession,
  secondsUntilExpiration,
} from "./agentSession";

describe("Funcionalidade: manter uma API key apenas durante a sessão", () => {
  it("Cenário: abrir uma sessão sem gravar a credencial no estado", () => {
    // Dado que a pessoa informa uma API key suficiente para a sessão
    const apiKey = "chave-de-sessao-apenas-em-memoria";
    // Quando a sessão local é aberta
    const session = openSession(apiKey, 1_000);
    // Então o estado contém apenas tempos e situação, não o segredo informado
    expect(session?.status).toBe("open");
    expect(JSON.stringify(session)).not.toContain(apiKey);
  });

  it("Cenário: prolongar a sessão somente por atividade local", () => {
    // Dado que uma sessão foi aberta
    const session = openSession("chave-de-sessao-apenas-em-memoria", 1_000)!;
    // Quando ocorre atividade antes da expiração
    const renewed = noteSessionActivity(session, 2_000);
    // Então a expiração é recalculada sem criar armazenamento persistente
    expect(renewed.expiresAt).toBe(2_000 + SESSION_IDLE_MS);
    expect(JSON.stringify(renewed)).not.toContain("chave-de-sessao");
  });

  it("Cenário: expirar uma sessão inativa e exigir nova credencial", () => {
    // Dado que uma sessão aberta não recebeu atividade até seu prazo
    const session = openSession("chave-de-sessao-apenas-em-memoria", 1_000)!;
    // Quando o prazo é ultrapassado
    const expired = expireSessionIfNeeded(session, 1_000 + SESSION_IDLE_MS);
    // Então o estado fica expirado e não fornece tempo restante
    expect(expired.status).toBe("expired");
    expect(secondsUntilExpiration(expired, 1_000 + SESSION_IDLE_MS)).toBe(0);
  });

  it("Cenário: encerrar a sessão não preserva estado de credencial", () => {
    // Dado que a pessoa encerra a sessão manualmente
    // Quando o componente troca para o estado fechado
    // Então não há dados de sessão que possam transportar uma API key
    expect(CLOSED_SESSION).toEqual({ status: "closed", openedAt: null, lastActivityAt: null, expiresAt: null });
  });
});
