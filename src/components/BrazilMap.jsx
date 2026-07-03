import { useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { motion } from "framer-motion";
import brasil from "../data/brazil-states.json";

const W = 560;
const H = 560;
const MAX_K = 8;

// trava a transformação para o mapa sempre cobrir a moldura (nunca fica branco)
function clamp(k, x, y) {
  if (!Number.isFinite(k)) k = 1;
  if (!Number.isFinite(x)) x = 0;
  if (!Number.isFinite(y)) y = 0;
  k = Math.min(MAX_K, Math.max(1, k));
  x = Math.min(0, Math.max(W - W * k, x));
  y = Math.min(0, Math.max(H - H * k, y));
  return { k, x, y };
}

export default function BrazilMap({ empresas, onSelect }) {
  const [hover, setHover] = useState(null);
  const [t, setT] = useState({ k: 1, x: 0, y: 0 });
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const gesto = useRef(null);

  const { paths, projetar } = useMemo(() => {
    const proj = geoMercator().fitSize([W, H], brasil);
    const path = geoPath().projection(proj);
    return { paths: brasil.features.map((f) => path(f)), projetar: (lon, lat) => proj([lon, lat]) };
  }, []);

  const pontos = useMemo(
    () =>
      empresas
        .map((e) => {
          const p = projetar(e.lon, e.lat);
          if (!p) return null;
          return { ...e, x: p[0], y: p[1] };
        })
        .filter(Boolean),
    [empresas, projetar]
  );

  function paraViewBox(clientX, clientY) {
    const el = svgRef.current;
    if (!el) return [W / 2, H / 2];
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return [W / 2, H / 2];
    return [((clientX - r.left) / r.width) * W, ((clientY - r.top) / r.height) * H];
  }

  // aplica zoom mantendo o ponto (px,py) fixo sob o cursor/pinça
  function zoomEm(px, py, fator) {
    if (!Number.isFinite(fator) || fator <= 0) return;
    setT((old) => {
      const k = Math.min(MAX_K, Math.max(1, old.k * fator));
      const gx = (px - old.x) / old.k;
      const gy = (py - old.y) / old.k;
      return clamp(k, px - gx * k, py - gy * k);
    });
  }

  function onWheel(ev) {
    ev.preventDefault();
    const [px, py] = paraViewBox(ev.clientX, ev.clientY);
    zoomEm(px, py, ev.deltaY < 0 ? 1.15 : 1 / 1.15);
  }

  // mouse: arrastar para mover (travado)
  function onMouseDown(ev) {
    gesto.current = { tipo: "pan", sx: ev.clientX, sy: ev.clientY, ox: t.x, oy: t.y };
  }
  function onMouseMove(ev) {
    const g = gesto.current;
    if (g?.tipo !== "pan") return;
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const dx = ((ev.clientX - g.sx) / r.width) * W;
    const dy = ((ev.clientY - g.sy) / r.height) * H;
    setT((old) => clamp(old.k, g.ox + dx, g.oy + dy));
  }
  function fimGesto() { gesto.current = null; }

  // touch: 1 dedo = mover, 2 dedos = pinça
  function dist(t0, t1) {
    return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
  }
  function onTouchStart(ev) {
    if (ev.touches.length === 2) {
      const [a, b] = ev.touches;
      gesto.current = { tipo: "pinca", d: dist(a, b) };
    } else if (ev.touches.length === 1) {
      gesto.current = { tipo: "pan", sx: ev.touches[0].clientX, sy: ev.touches[0].clientY, ox: t.x, oy: t.y };
    }
  }
  function onTouchMove(ev) {
    ev.preventDefault();
    const g = gesto.current;
    if (g?.tipo === "pinca" && ev.touches.length === 2) {
      const [a, b] = ev.touches;
      const d = dist(a, b);
      if (!g.d || !d) { g.d = d || g.d; return; }
      const [mx, my] = paraViewBox((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      zoomEm(mx, my, d / g.d);
      g.d = d;
    } else if (g?.tipo === "pan" && ev.touches.length === 1) {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      const dx = ((ev.touches[0].clientX - g.sx) / r.width) * W;
      const dy = ((ev.touches[0].clientY - g.sy) / r.height) * H;
      setT((old) => clamp(old.k, g.ox + dx, g.oy + dy));
    }
  }

  function aoEntrar(ev, p) {
    const dot = ev.target.getBoundingClientRect();
    const wrap = wrapRef.current.getBoundingClientRect();
    setHover({ ...p, left: dot.left + dot.width / 2 - wrap.left, top: dot.top - wrap.top });
  }

  const rDot = (h) => (h ? 5.5 : 3.2) / t.k;

  return (
    <div className="map-wrap" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="map-svg"
        preserveAspectRatio="xMidYMid meet"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={fimGesto}
        onMouseLeave={fimGesto}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={fimGesto}
        style={{ cursor: t.k > 1 ? "grab" : "default", touchAction: "none" }}
      >
        <g transform={`translate(${t.x},${t.y}) scale(${t.k})`}>
          {paths.map((d, i) => (
            <path key={i} d={d} className="map-state" style={{ strokeWidth: 0.6 / t.k }} />
          ))}
          {pontos.map((p, i) => (
            <motion.circle
              key={p.cnpj}
              cx={p.x}
              cy={p.y}
              r={rDot(hover?.cnpj === p.cnpj)}
              className="map-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.004, 0.6), duration: 0.4 }}
              onMouseEnter={(ev) => aoEntrar(ev, p)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(p.cnpj)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </g>
      </svg>

      {hover && (
        <div className="map-tooltip" style={{ left: hover.left, top: hover.top }}>
          <div className="mt-name">{hover.razao_limpa}</div>
          <div className="mt-meta">{hover.municipio} · {hover.uf}</div>
          <div className="mt-setor">{hover.setor}</div>
        </div>
      )}
    </div>
  );
}
