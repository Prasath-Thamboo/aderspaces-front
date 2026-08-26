"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { sdk } from "@/lib/medusa"
import { AddressForm, type AddressFormValues } from "@/components/account/AddressForm"
import { AccountTabs } from "@/components/account/AccountTabs"

type Address = AddressFormValues & { id: string }

export default function ComptePage() {
  const router = useRouter()
  const { customer, isLoading, logout, refresh } = useAuth()

  const [profile, setProfile] = useState({ first_name: "", last_name: "", phone: "" })
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "saved">("idle")

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressMode, setAddressMode] = useState<"none" | "add" | string>("none")

  useEffect(() => {
    if (!isLoading && !customer) router.push("/connexion")
  }, [isLoading, customer, router])

  useEffect(() => {
    if (customer) {
      setProfile({
        first_name: customer.first_name ?? "",
        last_name: customer.last_name ?? "",
        phone: customer.phone ?? "",
      })
    }
  }, [customer])

  const loadAddresses = useCallback(async () => {
    const { addresses } = await sdk.store.customer.listAddress()
    setAddresses(addresses as unknown as Address[])
  }, [])

  useEffect(() => {
    if (!customer) return
    loadAddresses()
  }, [customer, loadAddresses])

  if (isLoading || !customer) {
    return <p>Chargement…</p>
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileStatus("loading")
    try {
      await sdk.store.customer.update(profile)
      await refresh()
      setProfileStatus("saved")
      setTimeout(() => setProfileStatus("idle"), 2000)
    } catch {
      setProfileStatus("idle")
    }
  }

  const handleAddAddress = async (values: AddressFormValues) => {
    await sdk.store.customer.createAddress({ ...values, country_code: "fr" })
    await loadAddresses()
    setAddressMode("none")
  }

  const handleUpdateAddress = async (addressId: string, values: AddressFormValues) => {
    await sdk.store.customer.updateAddress(addressId, { ...values, country_code: "fr" })
    await loadAddresses()
    setAddressMode("none")
  }

  const handleDeleteAddress = async (addressId: string) => {
    await sdk.store.customer.deleteAddress(addressId)
    await loadAddresses()
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <article className="legal-page" style={{ maxWidth: "700px" }}>
      <h1>Mon compte</h1>
      <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem", color: "#3a362f" }}>
        Bonjour {customer.first_name || customer.email}.{" "}
        <button type="button" onClick={handleLogout} className="btn-text" style={{ padding: 0 }}>
          Se déconnecter
        </button>
      </p>

      <AccountTabs />

      {/* Profil */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Mes informations</h2>
        <form onSubmit={handleProfileSubmit} style={{ maxWidth: "420px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="first_name">Prénom</label>
              <input
                id="first_name"
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Nom</label>
              <input
                id="last_name"
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email-readonly">Email</label>
            <input id="email-readonly" type="email" value={customer.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={profileStatus === "loading"} className="btn-submit">
            {profileStatus === "loading" ? "Enregistrement…" : profileStatus === "saved" ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </form>
      </section>

      {/* Adresses */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Mes adresses</h2>

        {addresses.length === 0 && addressMode === "none" && (
          <p style={{ color: "#3a362f", marginBottom: "1rem" }}>Aucune adresse enregistrée.</p>
        )}

        <ul style={{ listStyle: "none", display: "grid", gap: "1rem" }}>
          {addresses.map((address) => (
            <li key={address.id} style={{ background: "var(--color-cream)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1.25rem" }}>
              {addressMode === address.id ? (
                <AddressForm
                  initial={address}
                  submitLabel="Mettre à jour"
                  onCancel={() => setAddressMode("none")}
                  onSubmit={(values) => handleUpdateAddress(address.id, values)}
                />
              ) : (
                <>
                  <p style={{ fontWeight: 600 }}>{address.first_name} {address.last_name}</p>
                  {address.company && <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{address.company}</p>}
                  <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{address.address_1}</p>
                  {address.address_2 && <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{address.address_2}</p>}
                  <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{address.postal_code} {address.city}</p>
                  {address.phone && <p style={{ fontSize: "0.9rem", color: "#3a362f" }}>{address.phone}</p>}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button type="button" onClick={() => setAddressMode(address.id)} className="btn-text" style={{ padding: 0 }}>Modifier</button>
                    <button type="button" onClick={() => handleDeleteAddress(address.id)} className="btn-text" style={{ padding: 0 }}>Supprimer</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {addressMode === "add" ? (
          <AddressForm submitLabel="Ajouter" onCancel={() => setAddressMode("none")} onSubmit={handleAddAddress} />
        ) : (
          <button type="button" onClick={() => setAddressMode("add")} className="btn-secondary" style={{ marginTop: "1rem" }}>
            Ajouter une adresse
          </button>
        )}
      </section>
    </article>
  )
}
