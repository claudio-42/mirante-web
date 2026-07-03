import { useEffect, useState } from "react";
import { getDemonstrativo } from "../api";
import { fmtRS } from "../format";

export default function DemonstrativoTab({ cnpj, tipo }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setDados(null);
    setErro(null);
    getDemonstrativo(cnpj, tipo).then(setDados).catch((e) => setErro(e.message));
  }, [cnpj, tipo]);

  if (erro) return <div className="error-box">{erro}</div>;
  if (!dados) return <div className="center-state"><div className="spinner" />Carregando demonstrativo…</div>;
  if (!dados.anos.length) return <p style={{ color: "var(--muted)" }}>Sem dados para este demonstrativo.</p>;

  return (
    <>
      <div className="kpi-grid">
        {dados.kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="lbl">{k.label}</div>
            <div className="val">{k.valor_fmt}</div>
          </div>
        ))}
      </div>

      <div className="demo-table-wrap">
        <table className="demo-table">
          <thead>
            <tr>
              <th>Conta</th>
              {dados.anos.map((a) => (
                <th key={a} className="num">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.contas.map((c) => (
              <tr key={c.cd_conta} className={c.nivel <= 1 ? "row-strong" : ""}>
                <td>
                  <span style={{ paddingLeft: (c.nivel - 1) * 16 }}>{c.ds_conta}</span>
                </td>
                {dados.anos.map((a) => (
                  <td key={a} className="num">{fmtRS(c.valores[a])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
