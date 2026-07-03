import { useEffect, useState } from "react";
import { getCatalogo, getEmpresa } from "./api";
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardTabs from "./components/DashboardTabs";

export default function App() {
  const [view, setView] = useState("landing");   // 'landing' | 'dashboard'
  const [catalogo, setCatalogo] = useState(null);
  const [cnpjSel, setCnpjSel] = useState(null);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [tema, setTema] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  // catálogo (para a barra lateral do dashboard) — carregado sob demanda
  useEffect(() => {
    if (view === "dashboard" && !catalogo) {
      getCatalogo().then(setCatalogo).catch((e) => setErro(e.message));
    }
  }, [view, catalogo]);

  useEffect(() => {
    if (!cnpjSel) return;
    setCarregando(true);
    setErro(null);
    getEmpresa(cnpjSel)
      .then((d) => { setDados(d); setCarregando(false); })
      .catch((e) => { setErro(e.message); setCarregando(false); });
  }, [cnpjSel]);

  function escolher(cnpj) {
    setCnpjSel(cnpj);
    setView("dashboard");
  }

  if (view === "landing") {
    return (
      <Landing
        onSelect={escolher}
        tema={tema}
        onToggleTema={() => setTema((t) => (t === "dark" ? "light" : "dark"))}
      />
    );
  }

  const emp = dados?.empresa;
  const anos = dados?.anos || [];
  const periodo = anos.length ? (anos.length > 1 ? `${anos[0]}–${anos[anos.length - 1]}` : `${anos[0]}`) : "—";

  return (
    <div className="layout">
      <Sidebar
        empresas={catalogo?.empresas || []}
        setores={catalogo?.setores || []}
        cnpjSel={cnpjSel}
        onSelect={setCnpjSel}
      />

      <main className="main">
        <button className="back-btn" onClick={() => setView("landing")}>← Mapa</button>

        <Header
          empresa={emp?.razao_limpa || "—"}
          setor={emp?.setor || ""}
          periodo={periodo}
          tema={tema}
          onToggleTema={() => setTema((t) => (t === "dark" ? "light" : "dark"))}
        />

        {carregando && (
          <div className="center-state"><div className="spinner" />Carregando análise…</div>
        )}

        {erro && (
          <div className="error-box" style={{ marginBottom: 20 }}>{erro}</div>
        )}

        {!carregando && dados && (
          <>
            <DashboardTabs dados={dados} cnpj={cnpjSel} />
            <div className="footer">Fonte: camada Gold (CVM/DFP) · Mirante.</div>
          </>
        )}
      </main>
    </div>
  );
}
