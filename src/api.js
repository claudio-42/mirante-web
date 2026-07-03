// Cliente da API. Em desenvolvimento aponta para a API local (uvicorn).
// No deploy (Vercel), defina a variável VITE_API_URL com a URL pública da API.
const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

async function pegar(rota) {
  const resp = await fetch(API + rota);
  if (!resp.ok) {
    let detalhe = `Erro ${resp.status}`;
    try {
      const j = await resp.json();
      if (j.detail) detalhe = j.detail;
    } catch (_) {}
    throw new Error(detalhe);
  }
  return resp.json();
}

export function getCatalogo() {
  return pegar("/api/empresas");
}

export function getMapa() {
  return pegar("/api/mapa");
}

export function getEmpresa(cnpj) {
  return pegar("/api/empresa?cnpj=" + encodeURIComponent(cnpj));
}

export function getDemonstrativo(cnpj, tipo) {
  return pegar("/api/demonstrativo?cnpj=" + encodeURIComponent(cnpj) + "&tipo=" + tipo);
}

export const MINERVA_CNPJ = "67.620.377/0001-14";
