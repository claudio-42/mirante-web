import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getMapa } from "../api";
import BrazilMap from "./BrazilMap";
import ThemeToggle from "./ThemeToggle";

const TITULO = "Mirante";
const SUBTITULO = "Inteligência financeira de companhias abertas · dados CVM";

export default function Landing({ onSelect, tema, onToggleTema }) {
  const [mapa, setMapa] = useState(null);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("Todos");

  useEffect(() => {
    getMapa().then(setMapa).catch((e) => setErro(e.message));
  }, []);

  const filtradas = useMemo(() => {
    if (!mapa) return [];
    let lista = mapa.empresas;
    if (setor !== "Todos") lista = lista.filter((e) => e.setor === setor);
    const termo = busca.trim().toLowerCase();
    if (termo) {
      const dig = termo.replace(/\D/g, "");
      lista = lista.filter((e) => {
        const nome = (e.razao_social || "").toLowerCase();
        const cnpjDig = (e.cnpj || "").replace(/\D/g, "");
        return nome.includes(termo) || (dig && cnpjDig.includes(dig));
      });
    }
    return lista;
  }, [mapa, setor, busca]);

  const sugestoes = useMemo(
    () => (busca.trim() ? filtradas.slice(0, 6) : []),
    [busca, filtradas]
  );

  if (erro) {
    return (
      <div className="center-state">
        <div className="error-box">
          <strong>Não consegui carregar o mapa.</strong>
          <p style={{ marginBottom: 0 }}>{erro}<br /><br />
          Confirme que a API está rodando em <code>http://127.0.0.1:8000</code>.</p>
        </div>
      </div>
    );
  }

  if (!mapa) {
    return <div className="center-state"><div className="spinner" />Carregando mapa…</div>;
  }

  const setores = ["Todos", ...mapa.setores];

  return (
    <div className="landing">
      <ThemeToggle tema={tema} onToggle={onToggleTema} />

      {/* setores na lateral esquerda */}
      <motion.aside
        className="sector-rail"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="rail-title">Setores</div>
        <div className="rail-list">
          {setores.map((s) => (
            <button
              key={s}
              className={"chip" + (s === setor ? " active" : "")}
              onClick={() => setSetor(s)}
            >
              {s === setor && (
                <motion.span
                  layoutId="railActive"
                  className="rail-indicator"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="chip-label">{s}</span>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* centro: título, busca e mapa */}
      <div className="landing-center">
        <motion.div
          className="landing-hero"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="landing-title">{TITULO}</h1>
          <p className="landing-subtitle">{SUBTITULO}</p>
        </motion.div>

        <motion.div
          className="landing-search"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <input
            className="search-big"
            placeholder="Busque por nome ou CNPJ"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {sugestoes.length > 0 && (
            <div className="search-suggest">
              {sugestoes.map((e) => (
                <button key={e.cnpj} className="suggest-item" onClick={() => onSelect(e.cnpj)}>
                  <span className="si-name">{e.razao_limpa}</span>
                  <span className="si-meta">{e.municipio} · {e.uf} · {e.setor}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="landing-map"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <BrazilMap empresas={filtradas} onSelect={onSelect} />
        </motion.div>
      </div>
    </div>
  );
}
