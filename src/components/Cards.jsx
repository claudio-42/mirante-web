// Cartão de KPI (Visão Geral).
export function KpiCard({ label, valor, delta, classe }) {
  const seta = classe === "pos" ? "▲" : classe === "neg" ? "▼" : "•";
  return (
    <div className="kpi">
      <div className="lbl">{label}</div>
      <div className="val">{valor}</div>
      <div className={"dlt " + classe}>{seta} {delta}</div>
    </div>
  );
}

// Bloco de análise automática (diagnóstico), em destaque.
const CORES = { good: "var(--good)", warn: "var(--warn)", bad: "var(--bad)", info: "var(--accent)" };
const ROTULOS = { good: "Favorável", warn: "Atenção", bad: "Risco", info: "Contexto" };

export function InsightBlock({ nivel, titulo, texto }) {
  const cor = CORES[nivel] || CORES.info;
  return (
    <div className="insight" style={{ "--c": cor }}>
      <div className="insight-head">
        <span className="insight-dot" />
        <span className="insight-tag">{ROTULOS[nivel] || "Contexto"}</span>
        <span className="insight-title">{titulo}</span>
      </div>
      <p className="insight-body">{texto}</p>
    </div>
  );
}
