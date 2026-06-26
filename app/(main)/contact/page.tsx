"use client"

import { useState } from "react"
import type { Metadata } from "next"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
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
      <h1>Contact</h1>
      <p style={{ marginBottom: "2rem", color: "#444" }}>
        Une question, un besoin d&apos;assistance ? Remplissez ce formulaire et nous vous répondrons sous 24h.
      </p>

      {status === "success" ? (
        <div style={{ background: "#f0faf0", border: "1px solid #4caf50", borderRadius: "6px", padding: "1.5rem", maxWidth: "600px" }}>
          <p style={{ color: "#2d6a2d", fontWeight: "600" }}>
            Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Votre nom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Décrivez votre demande…"
            />
          </div>

          {status === "error" && (
            <p style={{ color: "#c00", marginBottom: "1rem" }}>
              Une erreur est survenue. Veuillez réessayer ou nous écrire directement à contact@maisonprint.fr.
            </p>
          )}

          <button type="submit" disabled={status === "loading"} className="btn-submit">
            {status === "loading" ? "Envoi en cours…" : "Envoyer"}
          </button>
        </form>
      )}
    </article>
  )
}
