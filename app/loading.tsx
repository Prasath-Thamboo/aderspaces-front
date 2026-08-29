export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "flex", justifyContent: "center", padding: "5rem 2rem" }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "1.75rem",
          height: "1.75rem",
          border: "2px solid #DED5C4",
          borderTopColor: "#1C1B19",
          borderRadius: "50%",
          animation: "ader-spin 0.7s linear infinite",
        }}
      />
      <span className="sr-only">Chargement…</span>
      <style>{`
        @keyframes ader-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="ader-spin"] { animation-duration: 0s !important; }
        }
      `}</style>
    </div>
  )
}
