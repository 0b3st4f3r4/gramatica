/**
 * Caderno de Margem: marca de recorte — loop aberto e seta ascendente, sinal recorrente da edição.
 */
export function EditorialMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`editorial-mark ${className}`} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="21" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeDasharray="53 17" transform="rotate(-44 21 22)" />
      <path d="M22 7v18.5c0 3.6 2.9 6.5 6.5 6.5H35" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
      <path d="m29.5 26 6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
    </svg>
  );
}
