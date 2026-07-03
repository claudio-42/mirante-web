import ThemeToggle from "./ThemeToggle";

// Cabeçalho: marca Mirante + empresa em análise + toggle de tema (glass).
export default function Header({ empresa, setor, periodo, tema, onToggleTema }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo">M</div>
        <div>
          <div className="brand-name">Mirante</div>
          <div className="brand-tagline">Análise de Companhias Abertas</div>
        </div>
      </div>

      <div className="sep" />

      <div className="target">
        <div className="target-lbl">Empresa em análise</div>
        <div className="target-name">{empresa}</div>
        <div className="target-meta">{setor} &nbsp;·&nbsp; {periodo}</div>
      </div>

      <ThemeToggle tema={tema} onToggle={onToggleTema} />
    </div>
  );
}
