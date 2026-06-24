export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Cette page n'existe pas ou a été déplacée.</p>
      <a
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          background: "#1a1a1a",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Retour à l'accueil
      </a>
    </div>
  )
}
