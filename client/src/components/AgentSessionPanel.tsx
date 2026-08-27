/**
 * Caderno de Margem: porta de sessão efêmera. A credencial é mantida somente
 * em uma referência de memória e descartada sem persistência ao encerrar ou expirar.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyRound, LockKeyhole, Power, TimerReset } from "lucide-react";
import { EditorialMark } from "@/components/EditorialMark";
import {
  CLOSED_SESSION,
  expireSessionIfNeeded,
  noteSessionActivity,
  openSession,
  secondsUntilExpiration,
  type AgentSession,
} from "@/lib/agentSession";

function displayTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function AgentSessionPanel() {
  const apiKeyRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<AgentSession>(CLOSED_SESSION);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const discardCredential = useCallback((nextState: AgentSession) => {
    apiKeyRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
    setSession(nextState);
  }, []);

  const registerActivity = useCallback(() => {
    setSession((current) => noteSessionActivity(current));
  }, []);

  useEffect(() => {
    if (session.status !== "open") return;
    const interactions: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];
    interactions.forEach((eventName) => window.addEventListener(eventName, registerActivity, { passive: true }));
    return () => interactions.forEach((eventName) => window.removeEventListener(eventName, registerActivity));
  }, [registerActivity, session.status]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      setSession((current) => {
        const next = expireSessionIfNeeded(current, timestamp);
        if (next.status === "expired" && current.status === "open") apiKeyRef.current = null;
        return next;
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => { apiKeyRef.current = null; }, []);

  function handleOpen(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const apiKey = inputRef.current?.value ?? "";
    const nextSession = openSession(apiKey);
    if (!nextSession) {
      setError("Informe uma API key com pelo menos 12 caracteres para abrir a sessão.");
      return;
    }
    apiKeyRef.current = apiKey.trim();
    if (inputRef.current) inputRef.current.value = "";
    setError("");
    setSession(nextSession);
  }

  const open = session.status === "open";
  const seconds = secondsUntilExpiration(session, now);

  return (
    <section className={`agent-session ${open ? "is-open" : ""}`} aria-labelledby="agent-session-title">
      <div className="agent-session-copy">
        <p className="agent-session-kicker"><EditorialMark className="agent-session-mark" /> SESSÃO DE AGENTE · APENAS EM MEMÓRIA</p>
        <h3 id="agent-session-title">A credencial entra para trabalhar — não para ficar.</h3>
        <p>Ao abrir a sessão, a chave é lida diretamente deste campo e conservada somente enquanto a aba estiver ativa. Ela não é salva no dispositivo, não entra no registro de decisões e desaparece quando a sessão termina.</p>
      </div>

      <div className="agent-session-control" aria-live="polite">
        {open ? (
          <>
            <div className="session-status">
              <EditorialMark className="session-status-mark" />
              <div><strong>Sessão aberta</strong><small>credencial presente apenas na memória desta aba</small></div>
              <time><TimerReset size={14} /> {displayTime(seconds)}</time>
            </div>
            <button className="session-close" type="button" onClick={() => discardCredential(CLOSED_SESSION)}>
              <Power size={15} /> Encerrar e descartar chave
            </button>
          </>
        ) : (
          <form onSubmit={handleOpen}>
            <label htmlFor="agent-api-key">API key para esta sessão</label>
            <div className="agent-key-input">
              <LockKeyhole size={16} aria-hidden="true" />
              <input
                ref={inputRef}
                id="agent-api-key"
                type="password"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Cole a chave apenas para abrir a sessão"
                aria-describedby="agent-session-note agent-session-error"
              />
            </div>
            {error && <p id="agent-session-error" className="agent-session-error">{error}</p>}
            <button className="session-open" type="submit"><EditorialMark className="session-action-mark" /> Abrir sessão local</button>
          </form>
        )}
        <p id="agent-session-note" className="agent-session-note">
          {session.status === "expired"
            ? "A sessão expirou por inatividade e a chave foi descartada. Informe-a novamente para reabrir."
            : "Fechar, recarregar a página ou permanecer inativo por 20 minutos exige uma nova chave. Nenhuma chamada de agente é feita ao abrir a sessão."}
        </p>
      </div>
    </section>
  );
}
