// Toggle de tema em estilo "glass" com uma lâmpada.
// Tema claro = lâmpada acesa (glow); tema escuro = lâmpada apagada.
export default function ThemeToggle({ tema, onToggle }) {
  const acesa = tema === "light";
  return (
    <button
      className={"glass-toggle" + (acesa ? " on" : "")}
      onClick={onToggle}
      aria-label="Alternar tema claro/escuro"
      title={acesa ? "Apagar as luzes (tema escuro)" : "Acender as luzes (tema claro)"}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* bulbo */}
        <path
          d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9v.2h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={acesa ? "currentColor" : "none"}
          fillOpacity={acesa ? 0.18 : 0}
        />
        {/* raios (só quando acesa) */}
        {acesa && (
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
            <line x1="12" y1="0.5" x2="12" y2="2.2" />
            <line x1="3.2" y1="4" x2="4.4" y2="5.2" />
            <line x1="20.8" y1="4" x2="19.6" y2="5.2" />
          </g>
        )}
      </svg>
    </button>
  );
}
