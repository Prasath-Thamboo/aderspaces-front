"use client"

import { useState } from "react"

const STEPS = [
  { title: "Diagnostic", text: "Décrivez la panne via le formulaire ou en boutique : nous établissons un premier diagnostic gratuit." },
  { title: "Devis", text: "Vous recevez un devis détaillé sous 48h, sans engagement." },
  { title: "Réparation", text: "Une fois le devis validé, nos techniciens interviennent avec des pièces d'origine ou compatibles." },
  { title: "Restitution", text: "Votre appareil vous est restitué testé, avec une garantie de 3 mois sur l'intervention." },
]

export default function ReparationPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", deviceType: "", description: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/devis-reparation", {
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
      <h1>Réparation & maintenance</h1>
      <p style={{ marginTop: "0.75rem", marginBottom: "2.5rem", color: "#3a362f", maxWidth: "60ch" }}>
        Ordinateur lent, imprimante en panne, écran cassé ? Notre atelier prend en charge le diagnostic,
        la réparation et l&apos;entretien de vos équipements informatiques.
      </p>

      <section aria-label="Déroulement du service" style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.25rem" }}>Comment ça se passe</h2>
        <ol style={{ listStyle: "none", display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {STEPS.map((step, i) => (
            <li key={step.title} style={{ background: "var(--color-cream)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1.25rem" }}>
              <span className="badge">{i + 1}</span>
              <h3 style={{ fontSize: "1rem", margin: "0.5rem 0 0.4rem" }}>{step.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Demande de devis">
        <h2 style={{ marginBottom: "1rem" }}>Demander un devis</h2>

        {status === "success" ? (
          <div style={{ background: "#f0faf0", border: "1px solid #4caf50", borderRadius: "6px", padding: "1.5rem", maxWidth: "600px" }}>
            <p style={{ color: "#2d6a2d", fontWeight: 600 }}>
              Votre demande a bien été envoyée. Nous revenons vers vous sous 48h avec un devis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
            <div className="form-group">
              <label htmlFor="name">Nom *</label>
              <input id="name" type="text" required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input id="email" type="email" required value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="votre@email.fr" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" type="tel" value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="06 12 34 56 78" />
            </div>
            <div className="form-group">
              <label htmlFor="deviceType">Type d&apos;appareil *</label>
              <input id="deviceType" type="text" required value={form.deviceType}
                onChange={(e) => setForm((f) => ({ ...f, deviceType: e.target.value }))} placeholder="Ordinateur portable, imprimante…" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description de la panne *</label>
              <textarea id="description" rows={5} required value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Décrivez le problème rencontré…" />
            </div>

            {status === "error" && (
              <p style={{ color: "var(--color-terracotta)", marginBottom: "1rem" }}>
                Une erreur est survenue. Veuillez réessayer ou nous écrire à contact@aderspace.fr.
              </p>
            )}

            <button type="submit" disabled={status === "loading"} className="btn-submit">
              {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
          </form>
        )}
      </section>
    </article>
  )
}
