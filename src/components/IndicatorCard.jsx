import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Cartão de um indicador: valor mais recente (colorido pela classificação),
// variação a/a e um mini gráfico de linha com a série histórica.
const COR_CLASSE = {
  good: "var(--good)",
  warn: "var(--warn)",
  bad: "var(--bad)",
  info: "var(--accent)",
};

export default function IndicatorCard({ indicador }) {
  const { label, serie, ultimo, delta } = indicador;
  const classe = ultimo?.classe || "info";
  const corLinha = COR_CLASSE[classe] || "var(--accent)";

  const dados = (serie || [])
    .filter((p) => p.valor !== null && p.valor !== undefined)
    .map((p) => ({ ano: p.ano, valor: p.valor, fmt: p.valor_fmt }));

  return (
    <div className="ind-card">
      <div className="ic-top">
        <span className="ic-label">{label}</span>
        <span className={"ic-delta dlt " + (delta?.classe || "neu")}>{delta?.txt || "—"}</span>
      </div>
      <div className={"ic-value " + classe}>{ultimo?.valor_fmt ?? "N/A"}</div>

      <div style={{ height: 90, marginTop: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 4, right: 6, left: 6, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid)" vertical={false} />
            <XAxis
              dataKey="ano"
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text)",
              }}
              labelStyle={{ color: "var(--text-soft)" }}
              formatter={(v, n, p) => [p.payload.fmt, label]}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke={corLinha}
              strokeWidth={2.4}
              dot={{ r: 2.5, fill: corLinha }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
