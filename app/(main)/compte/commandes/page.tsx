"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { sdk } from "@/lib/medusa"
import { AccountTabs } from "@/components/account/AccountTabs"

type Order = {
  id: string
  display_id: number
  status: string
  total: number
  currency_code: string
  created_at: string
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  completed: "Terminée",
  archived: "Archivée",
  canceled: "Annulée",
  requires_action: "Action requise",
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

export default function CommandesPage() {
  const router = useRouter()
  const { customer, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!isLoading && !customer) router.push("/connexion")
  }, [isLoading, customer, router])

  useEffect(() => {
    if (!customer) return
    sdk.store.order.list({ limit: 50, fields: "id,display_id,status,total,currency_code,created_at" })
      .then(({ orders }) => setOrders(orders as unknown as Order[]))
      .catch(() => setOrders([]))
  }, [customer])

  if (isLoading || !customer) {
    return <p>Chargement…</p>
  }

  return (
    <article className="legal-page" style={{ maxWidth: "700px" }}>
      <h1>Mon compte</h1>
      <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem", color: "#3a362f" }}>
        Retrouvez ici l&apos;historique de vos commandes.
      </p>

      <AccountTabs />

      <section>
        <h2 style={{ marginBottom: "1rem" }}>Mes commandes</h2>
        {orders === null ? (
          <p style={{ color: "#3a362f" }}>Chargement…</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "#3a362f" }}>Vous n&apos;avez pas encore passé de commande.</p>
        ) : (
          <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem" }}>
            {orders.map((order) => (
              <li key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-cream)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1rem 1.25rem" }}>
                <div>
                  <p style={{ fontWeight: 600 }}>Commande #{order.display_id}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-neutral)" }}>{formatDate(order.created_at)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="price">{formatPrice(order.total, order.currency_code)}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-neutral)" }}>{ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
