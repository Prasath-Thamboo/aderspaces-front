"use client"

import { useState } from "react"

export type AddressFormValues = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  postal_code: string
  city: string
  phone: string
}

const EMPTY: AddressFormValues = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  postal_code: "",
  city: "",
  phone: "",
}

export function AddressForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Partial<AddressFormValues>
  onSubmit: (values: AddressFormValues) => Promise<void>
  onCancel: () => void
  submitLabel: string
}) {
  const [form, setForm] = useState<AddressFormValues>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const set = (key: keyof AddressFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await onSubmit(form)
    } catch {
      setError("Impossible d'enregistrer cette adresse.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "420px", marginTop: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label htmlFor="addr-first-name">Prénom *</label>
          <input id="addr-first-name" type="text" required value={form.first_name} onChange={set("first_name")} />
        </div>
        <div className="form-group">
          <label htmlFor="addr-last-name">Nom *</label>
          <input id="addr-last-name" type="text" required value={form.last_name} onChange={set("last_name")} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="addr-company">Société (optionnel)</label>
        <input id="addr-company" type="text" value={form.company} onChange={set("company")} />
      </div>
      <div className="form-group">
        <label htmlFor="addr-1">Adresse *</label>
        <input id="addr-1" type="text" required value={form.address_1} onChange={set("address_1")} />
      </div>
      <div className="form-group">
        <label htmlFor="addr-2">Complément d&apos;adresse</label>
        <input id="addr-2" type="text" value={form.address_2} onChange={set("address_2")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
        <div className="form-group">
          <label htmlFor="addr-postal">Code postal *</label>
          <input id="addr-postal" type="text" required value={form.postal_code} onChange={set("postal_code")} />
        </div>
        <div className="form-group">
          <label htmlFor="addr-city">Ville *</label>
          <input id="addr-city" type="text" required value={form.city} onChange={set("city")} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="addr-phone">Téléphone</label>
        <input id="addr-phone" type="tel" value={form.phone} onChange={set("phone")} />
      </div>

      {error && <p style={{ color: "var(--color-terracotta)", marginBottom: "1rem" }}>{error}</p>}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="submit" disabled={saving} className="btn-submit">
          {saving ? "Enregistrement…" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
      </div>
    </form>
  )
}
