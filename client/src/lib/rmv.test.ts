/** Caderno de Margem: provas executáveis da decisão, razão e atestação locais. */
import { describe, expect, it } from "vitest";
import { EMPTY_NOTEBOOK, blindSpotIsPriorToEvent, createAttestation, createLedgerEntry, createReexamination, deriveRank, digest, digestFile, evaluate, missingNotebookDeclarations, SCENARIOS } from "./rmv";

describe("Razão de Movimentos Verificáveis", () => {
  it("admite um movimento com prova completa e custo dentro do limiar sem confundir o portão com a derivação", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    expect(decision.state).toBe("accept");
    expect(decision.reasonCodes).toEqual([]);
    expect(decision.cost.total).toBe(0.62);
    expect(decision.derivation.rank).toBe("prediction-number");
  });

  it("nega custo acima do limiar, preservando a rota de reentrada", async () => {
    const decision = await evaluate(SCENARIOS.denied.event);
    expect(decision.state).toBe("deny");
    expect(decision.reasonCodes).toContain("COST_LIMIT_EXCEEDED");
    expect(decision.reviewAfter).toBe("reexame definido pela política situada");
    expect(decision.reentry).toContain("evidência");
  });

  it("mantém evidência ausente como indeterminação", async () => {
    const decision = await evaluate(SCENARIOS.indeterminate.event);
    expect(decision.state).toBe("indeterminate");
    expect(decision.missingEvidence).toEqual(["lockfile"]);
  });

  it("encadeia a razão e altera o digest quando a decisão muda", async () => {
    const accepted = await evaluate(SCENARIOS.accepted.event);
    const denied = await evaluate(SCENARIOS.denied.event);
    const first = await createLedgerEntry(accepted, undefined);
    const second = await createLedgerEntry(denied, first);
    expect(second.sequence).toBe(2);
    expect(second.previousHash).toBe(first.entryHash);
    expect(await digest(accepted)).not.toBe(await digest(denied));
  });

  it("emite atestação local com a cabeça da razão, evidências e posto", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const attestation = await createAttestation(decision, [entry]);
    expect(attestation.predicate.ledger.head).toBe(entry.entryHash);
    expect(attestation.scope).toContain("não é assinatura de identidade");
    expect(attestation.predicate.derivation.rank).toBe("prediction-number");
    expect(attestation.predicate.evidence).toHaveLength(3);
  });

  it("mantém um caso sem declaração como portão aberto", async () => {
    const event = { ...SCENARIOS.accepted.event, notebook: { ...EMPTY_NOTEBOOK, blindSpot: { ...EMPTY_NOTEBOOK.blindSpot } } };
    const decision = await evaluate(event);
    expect(missingNotebookDeclarations(event.notebook)).toContain("nome do caso");
    expect(decision.state).toBe("indeterminate");
    expect(decision.reasonCodes).toContain("NOTEBOOK_INCOMPLETE");
  });

  it("rebaixa uma moeda em metáfora controlada para ordenação", () => {
    const rank = deriveRank({ ...SCENARIOS.accepted.event.notebook, measurementStatus: "metaphor" });
    expect(rank.rank).toBe("ordering");
  });

  it("exige mapa de cegueira completo para que um proxy sustente previsão por contorno", async () => {
    const notebook = { ...SCENARIOS.accepted.event.notebook, measurementStatus: "proxy" as const, observationMode: "contour" as const, blindSpot: { ...EMPTY_NOTEBOOK.blindSpot } };
    const decision = await evaluate({ ...SCENARIOS.accepted.event, notebook });
    expect(decision.state).toBe("indeterminate");
    expect(decision.missingDeclarations).toContain("fonte do proxy");
    expect(decision.derivation.rank).toBe("ordering");
  });

  it("recusa mapa de cegueira declarado depois do evento", async () => {
    const notebook = { ...SCENARIOS.indeterminate.event.notebook, blindSpot: { ...SCENARIOS.indeterminate.event.notebook.blindSpot, declaredAt: "2026-08-28T00:00:00Z" } };
    const event = { ...SCENARIOS.indeterminate.event, evidence: ["commit", "lockfile", "build"], notebook };
    const decision = await evaluate(event);
    expect(blindSpotIsPriorToEvent(notebook, event.time)).toBe(false);
    expect(decision.reasonCodes).toContain("BLIND_SPOT_DECLARED_AFTER_EVENT");
    expect(decision.derivation.rank).toBe("ordering");
  });

  it("calcula digest de arquivo sem guardar seu conteúdo na evidência", async () => {
    const digest = await digestFile(new Blob(["conteúdo local"], { type: "text/plain" }));
    expect(digest).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(SCENARIOS.accepted.event.evidenceEnvelope[0]).not.toHaveProperty("content");
  });

  it("rebaixa ou revoga derivação conforme o veredito datado do reexame", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const limit = createReexamination(decision, "empirical-limit", "O proxy não captou a troca secundária.");
    const failure = createReexamination(decision, "clause-failure", "O vazamento persiste fora do mapa declarado.");
    expect(limit.nextRank).toBe("prediction-contour");
    expect(failure.nextRank).toBe("revogado");
  });
});
