"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO(prod) : remonter à un service de monitoring (Sentry) via son DSN en env.
    console.error(error)
  }, [error])

  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "38rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>Une erreur est survenue</h1>
      <p style={{ color: "#6b675c", marginBottom: "2rem", lineHeight: 1.7 }}>
        La page n&apos;a pas pu s&apos;afficher correctement. Vous pouvez réessayer&nbsp;; si le
        problème persiste, écrivez-nous à contact@aderspace.fr.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#1C1B19",
            color: "#FBF8F2",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Réessayer
        </button>
        <a
          href="/"
          style={{
            padding: "0.75rem 1.5rem",
            border: "1px solid #DED5C4",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  )
}
