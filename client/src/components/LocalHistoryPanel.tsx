/**
 * Caderno de Margem: consentimento explícito para persistir um instantâneo
 * permitido do laboratório nesta origem do navegador.
 */
import { ArchiveRestore, Eraser, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialMark } from "@/components/EditorialMark";

type Props = {
  enabled: boolean;
  savedAt: string | null;
  hasSession: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onSave: () => void;
  onRestore: () => void;
  onClear: () => void;
};

export function LocalHistoryPanel({ enabled, savedAt, hasSession, onEnabledChange, onSave, onRestore, onClear }: Props) {
  return (
    <section className="rmv-local-history" aria-labelledby="local-history-title">
      <div>
        <p className="rmv-kicker"><EditorialMark className="rmv-kicker-mark" /> G · MEMÓRIA LOCAL OPT-IN</p>
        <h2 id="local-history-title">Histórico exige uma ação explícita.</h2>
        <p>A sessão se encerra ao recarregar a página. Quando o histórico é registrado, o navegador guarda decisões, razões, reexames, ramos, carteiras e metadados de evidência permitidos. Arquivos, conteúdos, pacotes importados, credenciais e dados externos ficam fora do registro.</p>
      </div>
      <div className="history-consent-record">
        <label><input type="checkbox" checked={enabled} onChange={(event) => onEnabledChange(event.target.checked)} /> <span><strong>Ativar histórico nesta origem.</strong> O registro ocorre somente ao acionar o salvamento da sessão.</span></label>
        <div className="history-actions"><Button type="button" variant="outline" onClick={onSave} disabled={!enabled || !hasSession}><Save size={15} /> Registrar sessão permitida</Button><Button type="button" variant="outline" onClick={onRestore} disabled={!enabled}><ArchiveRestore size={15} /> Restaurar histórico</Button><button type="button" onClick={onClear}><Eraser size={14} /> Apagar histórico e retirar consentimento</button></div>
        <p className="history-status">{savedAt ? `Último registro local: ${new Date(savedAt).toLocaleString("pt-BR")}.` : "Nenhum histórico local foi registrado nesta sessão."}</p>
      </div>
    </section>
  );
}
