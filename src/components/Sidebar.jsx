import { useMemo, useState } from "react";

// Barra lateral: busca por nome/CNPJ, filtro de setor e lista de empresas.
export default function Sidebar({ empresas, setores, cnpjSel, onSelect }) {
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("Todos os setores");

  const filtradas = useMemo(() => {
    let lista = empresas;
    if (setor !== "Todos os setores") {
      lista = lista.filter((e) => e.setor === setor);
    }
    const termo = busca.trim().toLowerCase();
    if (termo) {
      const digitos = termo.replace(/\D/g, "");
      lista = lista.filter((e) => {
        const nome = (e.razao_social || "").toLowerCase();
        const cnpjDig = (e.cnpj || "").replace(/\D/g, "");
        return nome.includes(termo) || (digitos && cnpjDig.includes(digitos));
      });
    }
    return lista;
  }, [empresas, setor, busca]);

  return (
    <aside className="sidebar">
      <div className="brand-mini">
        <div className="logo">M</div>
        <div>
          <div className="name">Mirante</div>
          <div className="tag">CVM / DFP</div>
        </div>
      </div>

      <div className="field-label">Buscar</div>
      <input
        className="input"
        placeholder="Nome ou CNPJ"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="field-label">Setor / Categoria</div>
      <select className="select" value={setor} onChange={(e) => setSetor(e.target.value)}>
        <option>Todos os setores</option>
        {setores.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="count">{filtradas.length} empresa(s) encontrada(s)</div>

      <div className="company-list">
        {filtradas.map((e) => (
          <button
            key={e.cnpj}
            className={"company-item" + (e.cnpj === cnpjSel ? " active" : "")}
            onClick={() => onSelect(e.cnpj)}
          >
            <div className="ci-name">{e.razao_limpa}</div>
            <div className="ci-meta">{e.setor} · {e.cnpj}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}
