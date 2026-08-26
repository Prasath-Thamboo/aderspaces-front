"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { sdk } from "@/lib/medusa"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState(searchParams.get("email") ?? "")
  const [token, setToken] = useState(searchParams.get("token") ?? "")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setStatus("loading")
    try {
      await sdk.auth.updateProvider("customer", "emailpass", { email, password }, token)
      setStatus("success")
      setTimeout(() => router.push("/connexion"), 2000)
    } catch {
      setStatus("error")
      setError("Ce lien de réinitialisation est invalide ou a expiré.")
    }
  }

  return (
    <article className="legal-page">
      <h1>Réinitialiser le mot de passe</h1>
      <p style={{ marginTop: "0.75rem", marginBottom: "2rem", color: "#3a362f" }}>
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      {status === "success" ? (
        <div style={{ background: "#f0faf0", border: "1px solid #4caf50", borderRadius: "6px", padding: "1.5rem", maxWidth: "480px" }}>
          <p style={{ color: "#2d6a2d", fontWeight: 600 }}>
            Mot de passe mis à jour. Redirection vers la connexion…
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="token">Code de réinitialisation *</label>
            <input
              id="token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Collé automatiquement depuis le lien reçu par email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe *</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirmer le mot de passe *</label>
            <input
              id="passwordConfirm"
              type="password"
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "var(--color-terracotta)", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" disabled={status === "loading"} className="btn-submit">
            {status === "loading" ? "Mise à jour…" : "Réinitialiser le mot de passe"}
          </button>
        </form>
      )}
    </article>
  )
}
