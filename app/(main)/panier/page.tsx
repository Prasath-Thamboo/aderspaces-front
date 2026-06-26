"use client"

import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/cart"
import type { Metadata } from "next"

export default function PanierPage() {
  const { cart, removeItem, updateQuantity, isLoading } = useCart()
  const items = cart?.items ?? []
  const total = cart?.total ?? 0
  const currency = cart?.currency_code ?? "eur"

  return (
    <>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "2rem" }}>Mon panier</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1.5rem" }}>
            Votre panier est vide.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#1a1a1a",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Continuer mes achats
          </a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem", alignItems: "start" }}>
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1.5rem 0",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                {item.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{item.title}</p>
                  {item.variant?.title && (
                    <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      {item.variant.title}
                    </p>
                  )}
                  <p style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                    {formatPrice(item.unit_price * item.quantity, item.currency_code)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        style={{ padding: "0.35rem 0.75rem", border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}
                      >−</button>
                      <span style={{ padding: "0 0.5rem", minWidth: "2rem", textAlign: "center" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        style={{ padding: "0.35rem 0.75rem", border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      style={{ color: "#999", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: "1px solid #e5e5e5", borderRadius: "8px", padding: "1.5rem", position: "sticky", top: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.5rem" }}>Récapitulatif</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "700", paddingTop: "1rem", borderTop: "1px solid #e5e5e5" }}>
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
            <button
              disabled
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0.9rem",
                background: "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "not-allowed",
              }}
            >
              Paiement bientôt disponible
            </button>
            <a
              href="/"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1rem",
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              ← Continuer mes achats
            </a>
          </div>
        </div>
      )}
    </>
  )
}
