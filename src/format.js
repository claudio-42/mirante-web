// Formata valores monetários no padrão brasileiro (R$ mil / mi / bi).
export function fmtRS(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const s = v < 0 ? "-" : "";
  const a = Math.abs(v);
  const br = (n, d) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  if (a >= 1e9) return `${s}R$ ${br(a / 1e9, 2)} bi`;
  if (a >= 1e6) return `${s}R$ ${br(a / 1e6, 1)} mi`;
  if (a >= 1e3) return `${s}R$ ${br(a / 1e3, 1)} mil`;
  return `${s}R$ ${br(a, 0)}`;
}
