"use client"

import { useState } from "react"
import type { Metadata } from "next"

export default function MesDroitsPage() {
  const [form, setForm] = useState({ email: "", type: "acces", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/rgpd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <article className="legal-page">
      <h1>Exercer mes droits RGPD</h1>
      <p style={{ marginBottom: "2rem", color: "#444" }}>
        Conformément au RGPD, vous pouvez exercer vos droits sur vos données personnelles en remplissant
        ce formulaire. Nous répondrons dans un délai maximum d&apos;1 mois.
      </p>

      {status === "success" ? (
        <div style={{ background: "#f0faf0", border: "1px solid #4caf50", borderRadius: "6px", padding: "1.5rem" }}>
          <p style={{ color: "#2d6a2d", fontWeight: "600" }}>
            Votre demande a bien été envoyée. Nous vous répondrons dans les meilleurs délais.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
          <div className="form-group">
            <label htmlFor="email">Adresse email *</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="votre@email.fr"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type de demande *</label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="acces">Droit d&apos;accès à mes données</option>
              <option value="rectification">Droit de rectification</option>
              <option value="suppression">Droit à l&apos;effacement (« oubli »)</option>
              <option value="portabilite">Droit à la portabilité</option>
              <option value="opposition">Droit d&apos;opposition</option>
              <option value="limitation">Droit à la limitation du traitement</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Précisions (optionnel)</label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Précisez votre demande si nécessaire…"
            />
          </div>

          {status === "error" && (
            <p style={{ color: "#c00", marginBottom: "1rem" }}>
              Une erreur est survenue. Veuillez réessayer ou nous contacter à dpo@maisonprint.fr.
            </p>
          )}

          <button type="submit" disabled={status === "loading"} className="btn-submit">
            {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </form>
      )}
    </article>
  )
}
