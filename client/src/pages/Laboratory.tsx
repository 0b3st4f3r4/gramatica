/**
 * Caderno de Margem: página independente para testar a Gramática como prática
 * de decisão, sem interromper o percurso do manuscrito estático.
 */
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { RmvLab } from "@/components/RmvLab";
import { EditorialMark } from "@/components/EditorialMark";

const useCases = [
  {
    number: "01",
    title: "Publicar uma versão",
    body: "O percurso didático reúne commit, lockfile e build, declara a moeda e mantém seu custo dentro do limiar da política atual.",
    outcome: "Portão esperado: ADMITIDO",
  },
  {
    number: "02",
    title: "Reter um custo excessivo",
    body: "Quando as evidências estão completas, mas o custo ultrapassa o limite, o portão retém a ação e conserva uma rota de reexame.",
    outcome: "Portão esperado: RETIDO",
  },
  {
    number: "03",
    title: "Suspender uma decisão sem prova",
    body: "Quando falta evidência ou declaração obrigatória, a decisão permanece em aberto até que a lacuna seja nomeada ou suprida.",
    outcome: "Portão esperado: EM ABERTO",
  },
];

const opportunities = [
  {
    number: "I",
    title: "Prova material",
    body: "Ler commit, lockfile, build, arquivo-fonte e artefato como posições distintas. O laboratório pode mostrar quais provas sustentam um efeito e qual delas ainda falta.",
    practice: "Envelope de evidências.",
  },
  {
    number: "II",
    title: "Transformação", 
    body: "Fazer aparecer a passagem entre entrada, regra e saída: qual conteúdo foi transformado, por qual operação e com qual diferença observável entre as duas versões.",
    practice: "Percurso de transformação.",
  },
  {
    number: "III",
    title: "Endereço",
    body: "Dar a cada movimento uma referência estável, ligada ao seu digest, em vez de depender apenas de nomes mutáveis. Um endereço torna a retomada e a comparação possíveis.",
    practice: "Movimento reencontrável.",
  },
  {
    number: "IV",
    title: "Custo situado",
    body: "Substituir gradualmente o vetor simulado por medições declaradas de processamento, armazenamento, espera, reparo e partilha. O custo deixa de ser uma cifra única e ganha composição.",
    practice: "Moeda de consequência.",
  },
  {
    number: "V",
    title: "Tempo e repetição",
    body: "Registrar quando algo foi proposto, verificado, recusado e reaberto. A linha temporal torna visível que uma regra pode mudar de efeito quando o mesmo movimento retorna em outra condição.",
    practice: "Sequência datada.",
  },
  {
    number: "VI",
    title: "Contestação", 
    body: "Uma recusa pode receber objeção, nova prova ou revisão da própria regra. A contestação conserva a decisão anterior e acrescenta uma posição à razão.",
    practice: "Reingresso declarado.",
  },
];

const spineSections = [
  { id: "use-case-title", label: "CASOS" },
  { id: "opportunities-title", label: "MEIOS" },
  { id: "run-title", label: "PRÁTICA" },
  { id: "trajectory-title", label: "RAZÃO" },
  { id: "local-history-title", label: "MEMÓRIA" },
  { id: "limits-title", label: "LIMITE" },
];

export default function Laboratory() {
  const [activeSection, setActiveSection] = useState(spineSections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0.01, 0.2, 0.5] });
    spineSections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="laboratory-page">
      <header className="lab-page-header">
        <Link href="/" className="lab-return"><ArrowLeft size={16} /> Voltar ao manuscrito</Link>
        <div className="lab-page-brand"><EditorialMark /><span><b>GRAMÁTICA</b><b>DO MOVIMENTO</b><small>LABORATÓRIO LOCAL · EDIÇÃO DE TRABALHO</small></span></div>
      </header>

      <aside className="lab-route-spine" aria-label="Espinha de orientação do laboratório">
        <EditorialMark />
        <span>EM CURSO · {spineSections.find((section) => section.id === activeSection)?.label}</span>
        <div className="spine-progress" aria-hidden="true"><i style={{ transform: `scaleY(${(spineSections.findIndex((section) => section.id === activeSection) + 1) / spineSections.length})` }} /></div>
        <nav>{spineSections.map((section, index) => <a key={section.id} className={activeSection === section.id ? "is-active" : ""} aria-current={activeSection === section.id ? "location" : undefined} href={`#${section.id}`}><i>{String(index + 1).padStart(2, "0")}</i>{section.label}</a>)}</nav>
      </aside>

      <section className="lab-page-intro" aria-labelledby="laboratory-page-title">
        <div className="lab-intro-mark"><EditorialMark /></div>
        <p className="lab-page-eyebrow">MÓDULO DE APLICAÇÃO · EXECUÇÃO NO NAVEGADOR</p>
        <h1 id="laboratory-page-title">A decisão entra em rotina depois de passar pelo caderno.</h1>
        <p className="lab-page-deck">O caderno pede recorte, hospedeiro, moeda, troca, escala e refluxo antes da regra. A política decide a operação; o posto indica o alcance da derivação.</p>
        <div className="lab-page-principles" aria-label="Princípios do laboratório">
          <span><EditorialMark className="lab-principle-mark" /> prova antes de efeito</span>
          <span><EditorialMark className="lab-principle-mark" /> razão antes de recusa</span>
          <span><EditorialMark className="lab-principle-mark" /> dados ficam no navegador</span>
        </div>
      </section>

      <section className="lab-use-cases" aria-labelledby="use-case-title">
        <div className="lab-section-heading">
          <p>CASOS DE USO COBERTOS</p>
          <h2 id="use-case-title">O que cada percurso demonstra</h2>
          <span>Os exemplos didáticos usam a política de publicação: commit, lockfile, build e custo total de até 1,00 compute-credit. O caderno permite declarar outro caso sem transformar o exemplo em auditoria.</span>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <article key={useCase.number} className="use-case-card">
              <span>{useCase.number}</span>
              <h3>{useCase.title}</h3>
              <p>{useCase.body}</p>
              <strong>{useCase.outcome}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-opportunities" aria-labelledby="opportunities-title">
        <div className="lab-section-heading">
          <p>PRÓXIMO DO BIT</p>
          <h2 id="opportunities-title">Seis operações que ampliam o laboratório.</h2>
          <span>Prova, transformação, endereço, custo, tempo e contestação tornam a decisão mais legível sem ampliar sua autoridade.</span>
        </div>
        <div className="opportunity-register" aria-label="Oportunidades de enriquecimento">
          {opportunities.map((opportunity) => (
            <article key={opportunity.number} className="opportunity-row">
              <span>{opportunity.number}</span>
              <div><h3>{opportunity.title}</h3><p>{opportunity.body}</p></div>
              <strong>{opportunity.practice}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-run-section" aria-labelledby="run-title">
        <div className="lab-section-heading">
          <p>PRÁTICA ATUAL</p>
          <h2 id="run-title">A regra antecede o efeito.</h2>
          <span>Carregue um percurso ou escreva o seu. A razão conserva, nesta aba, a ordem, a decisão operacional e o posto de cada derivação.</span>
        </div>
        <RmvLab />
      </section>

      <section className="lab-limits" aria-labelledby="limits-title">
        <div>
          <p>ALCANCE E LIMITE</p>
          <h2 id="limits-title">O escopo deste laboratório.</h2>
        </div>
        <div className="lab-limit-list">
          <p><strong>Alcance:</strong> uma decisão operacional pode ser reconstruída a partir de política, evidências declaradas, custo e registro de sequência.</p>
          <p><strong>Fora de escopo:</strong> justiça universal da regra, universalidade do custo e auditoria independente do registro local.</p>
          <p><strong>Arquivo baixado:</strong> caderno, posto, política e estado da sessão no instante da exportação; uma atestação de integridade local, sem assinatura de identidade.</p>
        </div>
      </section>

      <footer className="lab-page-footer">
        <p>Manuscrito e laboratório têm funções distintas: o primeiro formula; o segundo registra uma aplicação situada.</p>
        <Link href="/" className="lab-return">Retornar à leitura <ArrowUpRight size={15} /></Link>
      </footer>
    </main>
  );
}
