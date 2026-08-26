"use client"

import { useState } from "react"
import { sdk } from "@/lib/medusa"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      await sdk.auth.resetPassword("customer", "emailpass", { identifier: email })
    } catch {
      // On affiche toujours le même message, pour ne pas révéler si l'email existe.
    } finally {
      setStatus("sent")
    }
  }

  return (
    <article className="legal-page">
      <h1>Mot de passe oublié</h1>
      <p style={{ marginTop: "0.75rem", marginBottom: "2rem", color: "#3a362f" }}>
        Indiquez votre email, nous vous envoyons un lien de réinitialisation valable 15 minutes.
      </p>

      {status === "sent" ? (
        <div style={{ background: "#f0faf0", border: "1px solid #4caf50", borderRadius: "6px", padding: "1.5rem", maxWidth: "480px" }}>
          <p style={{ color: "#2d6a2d", fontWeight: 600 }}>
            Si un compte existe pour cet email, un lien de réinitialisation vient d&apos;être envoyé.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
            />
          </div>
          <button type="submit" disabled={status === "loading"} className="btn-submit">
            {status === "loading" ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      )}
    </article>
  )
}
