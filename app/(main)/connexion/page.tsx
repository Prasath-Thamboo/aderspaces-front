"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function ConnexionPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError("")
    try {
      await login(form.email, form.password)
      router.push("/compte")
    } catch {
      setStatus("error")
      setError("Email ou mot de passe incorrect.")
    }
  }

  return (
    <article className="legal-page">
      <h1>Connexion</h1>
      <p style={{ marginTop: "0.75rem", marginBottom: "2rem", color: "#3a362f" }}>
        Accédez à votre compte pour suivre vos commandes et gérer vos informations.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="votre@email.fr"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe *</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
        </div>

        {status === "error" && (
          <p style={{ color: "var(--color-terracotta)", marginBottom: "1rem" }}>{error}</p>
        )}

        <button type="submit" disabled={status === "loading"} className="btn-submit">
          {status === "loading" ? "Connexion…" : "Se connecter"}
        </button>

        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#3a362f" }}>
          <a href="/mot-de-passe-oublie">Mot de passe oublié ?</a>
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#3a362f" }}>
          Pas encore de compte ? <a href="/inscription">Créer un compte</a>
        </p>
      </form>
    </article>
  )
}
