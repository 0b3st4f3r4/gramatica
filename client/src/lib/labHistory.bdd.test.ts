/** Caderno de Margem: cenários BDD da memória local escolhida pela pessoa. */
import { describe, expect, it } from "vitest";
import { createLedgerEntry, evaluate, SCENARIOS } from "./rmv";
import { LAB_HISTORY_KEY, clearLocalLabHistory, createLocalLabHistory, loadLocalLabHistory, saveLocalLabHistory } from "./labHistory";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as Storage;
}

describe("Funcionalidade: guardar a razão somente por consentimento local", () => {
  it("Cenário: criar um instantâneo permitido sem conteúdo de arquivo", async () => {
    const decision = await evaluate(SCENARIOS.accepted.event);
    const entry = await createLedgerEntry(decision, undefined);
    const snapshot = createLocalLabHistory([decision], [entry], [], [], [], [], []);
    expect(snapshot.scope).toContain("histórico local escolhido");
    expect(JSON.stringify(snapshot)).not.toContain('"content"');
    expect(JSON.stringify(snapshot)).not.toContain("apiKey");
  });

  it("Cenário: persistir somente após uma ação explícita e restaurar quando solicitado", async () => {
    const storage = memoryStorage();
    const decision = await evaluate(SCENARIOS.accepted.event);
    const snapshot = createLocalLabHistory([decision], [], [], [], [], [], []);
    expect(storage.getItem(LAB_HISTORY_KEY)).toBeNull();
    expect(saveLocalLabHistory(snapshot, storage)).toBe(true);
    expect(loadLocalLabHistory(storage)?.decisions).toHaveLength(1);
  });

  it("Cenário: apagar o histórico e retirar o registro local", async () => {
    const storage = memoryStorage();
    const decision = await evaluate(SCENARIOS.accepted.event);
    saveLocalLabHistory(createLocalLabHistory([decision], [], [], [], [], [], []), storage);
    expect(clearLocalLabHistory(storage)).toBe(true);
    expect(loadLocalLabHistory(storage)).toBeNull();
  });
});
