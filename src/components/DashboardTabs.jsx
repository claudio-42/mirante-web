import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { KpiCard, InsightBlock } from "./Cards";
import IndicatorCard from "./IndicatorCard";
import DemonstrativoTab from "./DemonstrativoTab";

const TABS = [
  { id: "visao", label: "Visão Geral" },
  { id: "liquidez", label: "Liquidez", grupos: ["Liquidez"], diag: ["Liquidez"] },
  { id: "endiv", label: "Endividamento", grupos: ["Endividamento"], diag: ["Endividamento"] },
  { id: "margens", label: "Margens e Rentabilidade", grupos: ["Margens", "Rentabilidade"], diag: ["Margens", "Rentabilidade"] },
  { id: "atividade", label: "Atividade e Ciclos", grupos: ["Atividade", "Ciclos"], diag: ["Ciclos"] },
  { id: "fleuriet", label: "Fleuriet", grupos: ["Fleuriet"], diag: ["Fleuriet"] },
  { id: "bp", label: "Balanço", tipo: "bp" },
  { id: "dre", label: "DRE", tipo: "dre" },
  { id: "dfc", label: "DFC", tipo: "dfc" },
];

export default function DashboardTabs({ dados, cnpj }) {
  const [ativa, setAtiva] = useState("visao");
  const anos = dados.anos || [];
  const anoAtual = anos[anos.length - 1];

  const grupos = useMemo(() => {
    const mapa = {};
    dados.indicadores.forEach((ind) => {
      (mapa[ind.grupo] = mapa[ind.grupo] || []).push(ind);
    });
    return mapa;
  }, [dados]);

  const tab = TABS.find((t) => t.id === ativa);

  function conteudo() {
    if (ativa === "visao") {
      return (
        <>
          <div className="section-title">Visão geral · {anoAtual}</div>
          <div className="kpi-grid">
            {dados.kpis.map((k, i) => (
              <KpiCard key={i} label={k.label} valor={k.valor_fmt}
                       delta={k.delta_txt} classe={k.delta_classe} />
            ))}
          </div>
          <div className="section-title">Diagnóstico executivo</div>
          {dados.diagnostico.length === 0 && (
            <p style={{ color: "var(--muted)" }}>Dados insuficientes para gerar o diagnóstico.</p>
          )}
          {dados.diagnostico.map((ins, i) => (
            <InsightBlock key={i} nivel={ins.nivel} titulo={ins.titulo} texto={ins.texto} />
          ))}
        </>
      );
    }

    if (tab.tipo) {
      return <DemonstrativoTab cnpj={cnpj} tipo={tab.tipo} />;
    }

    // aba de grupo de indicadores
    const insights = dados.diagnostico.filter((d) => tab.diag.includes(d.grupo));
    return (
      <>
        {tab.grupos.map((g) =>
          grupos[g] ? (
            <div key={g}>
              <div className="section-title">{g}</div>
              <div className="ind-grid">
                {grupos[g].map((ind) => (
                  <IndicatorCard key={ind.chave} indicador={ind} />
                ))}
              </div>
            </div>
          ) : null
        )}
        {insights.length > 0 && (
          <>
            <div className="section-title">Análise automática</div>
            {insights.map((ins, i) => (
              <InsightBlock key={i} nivel={ins.nivel} titulo={ins.titulo} texto={ins.texto} />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"dash-tab" + (t.id === ativa ? " active" : "")}
            onClick={() => setAtiva(t.id)}
          >
            {t.id === ativa && (
              <motion.span
                layoutId="dashTab"
                className="dash-indicator"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="dash-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">{conteudo()}</div>
    </>
  );
}
