/** Caderno de Margem: cenários BDD executáveis para o caderno de caso local. */
import { describe, expect, it } from "vitest";
import { DEFAULT_PARALLEL_WALLETS, EMPTY_NOTEBOOK, archiveTrajectoryBranch, branchIsArchived, buildTrajectory, compareImportedAttestation, createAttestation, createAttestationIndexEntry, createDivergenceComment, createDivergenceReport, createLedgerEntry, createReexamination, createReexaminationDeadline, createTrajectoryBranch, createTrajectoryExport, digestFile, evaluate, filterDivergences, filterTrajectoryByBranch, inspectImportedAttestation, reexaminationDeadlineStatus, reopenTrajectoryBranch, SCENARIOS } from "./rmv";

describe("Funcionalidade: decidir e reexaminar um caso no caderno local", () => {
  it("Cenário: publicar uma versão com evidências completas e custo dentro do limite", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    expect(decision.state).toBe("accept");
    expect(decision.reasonCodes).toEqual([]);
    expect(decision.cost.total).toBe(0.62);
    expect(decision.derivation.rank).toBe("prediction-number");
  });

  it("Cenário: reter uma publicação cujo custo excede o limite", async () => {
    const decision = await evaluate(SCENARIOS.denied.event);
    expect(decision.state).toBe("deny");
    expect(decision.reasonCodes).toContain("COST_LIMIT_EXCEEDED");
    expect(decision.reviewAfter).toBe("reexame definido pela política situada");
  });

  it("Cenário: manter a decisão aberta quando uma evidência está ausente", async () => {
    const decision = await evaluate(SCENARIOS.indeterminate.event);
    expect(decision.state).toBe("indeterminate");
    expect(decision.missingEvidence).toEqual(["lockfile"]);
    expect(decision.reasonCodes).toContain("EVIDENCE_INCOMPLETE");
  });

  it("Cenário: preservar uma sequência de decisões e exportar sua atestação", async () => {
    const accepted = await evaluate(SCENARIOS.accepted.event);
    const denied = await evaluate(SCENARIOS.denied.event);
    const first = await createLedgerEntry(accepted, undefined);
    const second = await createLedgerEntry(denied, first);
    const attestation = await createAttestation(denied, [first, second]);
    expect(second.previousHash).toBe(first.entryHash);
    expect(attestation.predicate.ledger.entries).toBe(2);
    expect(attestation.predicate.ledger.head).toBe(second.entryHash);
  });

  it("Cenário: manter um caderno sem as sete declarações como decisão em aberto", async () => {
    const decision = await evaluate({ ...SCENARIOS.accepted.event, notebook: { ...EMPTY_NOTEBOOK, blindSpot: { ...EMPTY_NOTEBOOK.blindSpot } } });
    expect(decision.state).toBe("indeterminate");
    expect(decision.reasonCodes).toContain("NOTEBOOK_INCOMPLETE");
  });

  it("Cenário: separar uma decisão admitida de uma derivação por ordenação", async () => {
    const event = { ...SCENARIOS.accepted.event, notebook: { ...SCENARIOS.accepted.event.notebook, measurementStatus: "metaphor" as const } };
    const decision = await evaluate(event);
    expect(decision.state).toBe("accept");
    expect(decision.derivation.rank).toBe("ordering");
  });

  it("Cenário: atestar um arquivo sem reter seu conteúdo", async () => {
    const hash = await digestFile(new Blob(["registro"], { type: "text/plain" }));
    expect(hash).toMatch(/^sha256:/);
    expect(SCENARIOS.accepted.event.evidenceEnvelope.every((record) => !("content" in record))).toBe(true);
  });

  it("Cenário: rebaixar uma previsão quando o limite já estava no mapa", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const reexamination = createReexamination(decision, "empirical-limit", "O ponto cego declarado se confirmou.");
    expect(reexamination.priorRank).toBe("prediction-number");
    expect(reexamination.nextRank).toBe("prediction-contour");
  });

  it("Cenário: manter o portão aberto quando o mapa foi declarado depois do evento", async () => {
    const notebook = { ...SCENARIOS.indeterminate.event.notebook, blindSpot: { ...SCENARIOS.indeterminate.event.notebook.blindSpot, declaredAt: "2026-08-28T00:00:00Z" } };
    const decision = await evaluate({ ...SCENARIOS.indeterminate.event, evidence: ["commit", "lockfile", "build"], notebook });
    expect(decision.state).toBe("indeterminate");
    expect(decision.reasonCodes).toContain("BLIND_SPOT_DECLARED_AFTER_EVENT");
  });

  it("Cenário: revogar uma derivação quando a cláusula falha fora do mapa", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const reexamination = createReexamination(decision, "clause-failure", "A troca não existe e o ponto não era cego.");
    expect(reexamination.nextRank).toBe("revogado");
  });

  it("Cenário: ler decisões e reexames como uma trajetória, sem reduzi-los a placar", async () => {
    const first = await evaluate(SCENARIOS.accepted.event);
    const second = await evaluate(SCENARIOS.denied.event);
    const reexamination = createReexamination(second, "exchange-shift", "A troca descrita precisou ser refeita.");
    const trajectory = buildTrajectory([first, second], [reexamination]);
    expect(trajectory).toHaveLength(2);
    expect(trajectory[1].decision).toBe("deny");
    expect(trajectory[1].ruptures).toEqual(["exchange-shift"]);
  });

  it("Cenário: manter carteiras paralelas em suas próprias unidades", () => {
    expect(DEFAULT_PARALLEL_WALLETS.map((wallet) => wallet.unit)).toEqual(["minutos", "ocorrências"]);
    expect(DEFAULT_PARALLEL_WALLETS[0].currency).not.toBe(DEFAULT_PARALLEL_WALLETS[1].currency);
  });

  it("Cenário: confrontar pacote com política e razão declaradas", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const attestation = await createAttestation(decision, [entry]);
    const imported = inspectImportedAttestation(attestation);
    const comparison = compareImportedAttestation(decision, [entry], imported);
    expect(imported.valid).toBe(true);
    expect(comparison.ready).toBe(true);
    expect(comparison.samePolicy).toBe(true);
    expect(comparison.sameLedgerHead).toBe(true);
  });

  it("Cenário: marcar pacote incompatível sem absorvê-lo como prova", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const invalid = inspectImportedAttestation({ _type: "outro.pacote" });
    const comparison = compareImportedAttestation(decision, [], invalid);
    expect(invalid.valid).toBe(false);
    expect(comparison.ready).toBe(false);
    expect(comparison.notes[0]).toContain("Tipo de atestação");
  });

  it("Cenário: bifurcar uma trajetória sem reescrever o tronco", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const origin = await createLedgerEntry(decision, undefined);
    const branch = createTrajectoryBranch(origin, "Outra hipótese de troca.", "troca alternativa");
    const branchDecision = { ...decision, id: `${decision.id}:ramo`, branchId: branch.id };
    const branchEntry = await createLedgerEntry(branchDecision, origin, branch.id);
    expect(branch.sourceLedgerHash).toBe(origin.entryHash);
    expect(branchEntry.previousHash).toBe(origin.entryHash);
    expect(branchEntry.branchId).toBe(branch.id);
    expect(origin.branchId).toBe("tronco");
  });

  it("Cenário: relatar divergência de moeda sem converter as posições", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const imported = inspectImportedAttestation(await createAttestation(decision, [entry]));
    const comparison = compareImportedAttestation(decision, [entry], { ...imported, currency: "tempo de espera" });
    const currency = comparison.differences.find((difference) => difference.field === "moeda");
    expect(comparison.ready).toBe(true);
    expect(currency?.equal).toBe(false);
    expect(currency?.imported).toBe("tempo de espera");
  });

  it("Cenário: filtrar a matriz por ramo sem apagar a trajetória de origem", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const origin = await createLedgerEntry(decision, undefined);
    const branch = createTrajectoryBranch(origin, "Leitura alternativa.");
    const branchDecision = { ...decision, id: `${decision.id}:filtro`, branchId: branch.id };
    const trajectory = buildTrajectory([decision, branchDecision], []);
    expect(filterTrajectoryByBranch(trajectory, branch.id)).toEqual([trajectory[1]]);
    expect(filterTrajectoryByBranch(trajectory, "tronco")).toEqual([trajectory[0]]);
    expect(filterTrajectoryByBranch(trajectory, "all")).toHaveLength(2);
  });

  it("Cenário: exportar diferenças declaradas sem incorporar o pacote confrontado", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const imported = inspectImportedAttestation(await createAttestation(decision, [entry]));
    const comparison = compareImportedAttestation(decision, [entry], imported);
    const report = createDivergenceReport(decision, [entry], imported, comparison);
    expect(report._type).toBe("org.gramatica.local-divergence-report/v1");
    expect(report.fields).toHaveLength(5);
    expect(report.scope).toContain("Não verifica identidade");
  });

  it("Cenário: declarar um prazo sem reescrever a decisão e distinguir pendência, vencimento e reexame", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const deadline = createReexaminationDeadline(decision, "2026-08-30T23:59:59.000Z", "Retomar a troca declarada.");
    expect(reexaminationDeadlineStatus(deadline, [], new Date("2026-08-28T00:00:00Z"))).toBe("pending");
    expect(reexaminationDeadlineStatus(deadline, [], new Date("2026-09-01T00:00:00Z"))).toBe("expired");
    const reexamination = { ...createReexamination(decision, "application-artifact", "Correção registrada."), recordedAt: "2026-08-29T00:00:00Z" };
    expect(reexaminationDeadlineStatus(deadline, [reexamination], new Date("2026-09-01T00:00:00Z"))).toBe("reexamined");
    expect(decision.state).toBe("accept");
  });

  it("Cenário: anotar uma divergência sem absorver a atestação confrontada", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const imported = inspectImportedAttestation(await createAttestation(decision, [entry]));
    const comparison = compareImportedAttestation(decision, [entry], { ...imported, currency: "tempo de espera" });
    const difference = comparison.differences.find((item) => item.field === "moeda")!;
    const comment = createDivergenceComment(difference, "A diferença pede carteira paralela, não conversão.");
    const report = createDivergenceReport(decision, [entry], imported, comparison, [comment]);
    expect(report.comments[0].text).toContain("carteira paralela");
    expect(report.imported).not.toHaveProperty("raw");
  });

  it("Cenário: exportar apenas o recorte filtrado de uma trajetória", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const origin = await createLedgerEntry(decision, undefined);
    const branch = createTrajectoryBranch(origin, "Hipótese alternativa.");
    const branchDecision = { ...decision, id: `${decision.id}:export`, branchId: branch.id };
    const selected = filterTrajectoryByBranch(buildTrajectory([decision, branchDecision], []), branch.id);
    const exported = createTrajectoryExport(selected, branch.id, branch.label, branch.sourceLedgerHash);
    expect(exported.branch.id).toBe(branch.id);
    expect(exported.steps).toHaveLength(1);
    expect(exported.limits.join(" ")).toContain("não substitui");
  });

  it("Cenário: arquivar um ramo sem apagar sua origem nem suas posições", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const origin = await createLedgerEntry(decision, undefined);
    const branch = createTrajectoryBranch(origin, "Hipótese encerrada.");
    const archived = archiveTrajectoryBranch(branch, "A condição de troca não se sustenta.");
    expect(branchIsArchived(archived)).toBe(true);
    expect(archived.sourceLedgerHash).toBe(origin.entryHash);
    expect(archived.archiveReason).toContain("não se sustenta");
  });

  it("Cenário: reabrir um ramo preservando o encerramento que o antecedeu", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const origin = await createLedgerEntry(decision, undefined);
    const archived = archiveTrajectoryBranch(createTrajectoryBranch(origin, "Hipótese encerrada."), "O primeiro percurso se fechou.");
    const reopened = reopenTrajectoryBranch(archived, "Nova evidência exige retorno situado.");
    expect(branchIsArchived(reopened)).toBe(false);
    expect(reopened.archiveHistory).toHaveLength(1);
    expect(reopened.archiveHistory?.[0].reason).toContain("primeiro percurso");
    expect(reopened.archiveHistory?.[0].reopenReason).toContain("Nova evidência");
    expect(reopened.sourceLedgerHash).toBe(origin.entryHash);
  });

  it("Cenário: manter no índice apenas metadados da atestação criada nesta sessão", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const indexEntry = createAttestationIndexEntry(decision, [entry], "2026-08-27T12:00:00.000Z");
    expect(indexEntry.ledgerHead).toBe(entry.entryHash);
    expect(indexEntry).not.toHaveProperty("attestation");
    expect(indexEntry).not.toHaveProperty("evidenceEnvelope");
  });

  it("Cenário: filtrar divergências por diferença ou por campo sem apagá-las", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const imported = inspectImportedAttestation(await createAttestation(decision, [entry]));
    const comparison = compareImportedAttestation(decision, [entry], { ...imported, currency: "tempo de espera" });
    expect(filterDivergences(comparison.differences, "divergent").map((item) => item.field)).toEqual(["moeda"]);
    expect(filterDivergences(comparison.differences, "moeda")).toHaveLength(1);
    expect(filterDivergences(comparison.differences, "all")).toHaveLength(5);
  });
});
