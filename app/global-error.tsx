"use client"

import { useEffect } from "react"

/**
 * Filet de sécurité de dernier recours : ne se déclenche que si le layout
 * racine lui-même lève une erreur. Doit fournir ses propres <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#F5F1EA",
          color: "#1C1B19",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Service momentanément indisponible</h1>
          <p style={{ color: "#6b675c", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Merci de réessayer dans un instant.
          </p>
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
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
