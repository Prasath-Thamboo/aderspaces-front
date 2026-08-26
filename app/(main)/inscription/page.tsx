"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function InscriptionPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setStatus("loading")
    try {
      await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      })
      router.push("/compte")
    } catch {
      setStatus("error")
      setError("Impossible de créer le compte. Cet email est peut-être déjà utilisé.")
    }
  }

  return (
    <article className="legal-page">
      <h1>Créer un compte</h1>
      <p style={{ marginTop: "0.75rem", marginBottom: "2rem", color: "#3a362f" }}>
        Un compte est nécessaire pour passer commande sur Aderspace.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label htmlFor="first_name">Prénom *</label>
            <input
              id="first_name"
              type="text"
              required
              autoComplete="given-name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Nom *</label>
            <input
              id="last_name"
              type="text"
              required
              autoComplete="family-name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
        </div>

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
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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
            value={form.passwordConfirm}
            onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
          />
        </div>

        {error && <p style={{ color: "var(--color-terracotta)", marginBottom: "1rem" }}>{error}</p>}

        <button type="submit" disabled={status === "loading"} className="btn-submit">
          {status === "loading" ? "Création…" : "Créer mon compte"}
        </button>

        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#3a362f" }}>
          Déjà un compte ? <a href="/connexion">Se connecter</a>
        </p>
      </form>
    </article>
  )
}
