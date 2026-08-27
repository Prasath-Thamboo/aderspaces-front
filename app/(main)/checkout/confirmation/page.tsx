"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { sdk } from "@/lib/medusa"
import { getCartId, formatPrice } from "@/lib/cart"
import { useCart } from "@/contexts/CartContext"
import { completeCheckout } from "@/lib/checkout"

function ConfirmationInner() {
  const params = useSearchParams()
  const { clearCart } = useCart()
  const orderIdParam = params.get("order")
  const redirectStatus = params.get("redirect_status")

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        let orderId = orderIdParam

        // Retour depuis un 3D Secure Stripe (redirection) : finaliser le panier.
        if (!orderId && redirectStatus === "succeeded") {
          const cartId = getCartId()
          if (cartId) {
            const res: any = await completeCheckout(cartId)
            if (res?.type === "order") {
              orderId = res.order.id
              clearCart()
            }
          }
        }

        if (!orderId) {
          if (!cancelled) setStatus("error")
          return
        }

        const { order: fetched } = await sdk.store.order.retrieve(orderId, {
          fields: "*items,*shipping_address,*shipping_methods,+total,+currency_code,+email,+display_id",
        })
        if (cancelled) return
        setOrder(fetched)
        setStatus("ok")
      } catch {
        if (!cancelled) setStatus("error")
      }
    })()

    return () => { cancelled = true }
  }, [orderIdParam, redirectStatus, clearCart])

  if (status === "loading") {
    return <p className="checkout-muted">Confirmation de votre commande…</p>
  }

  if (status === "error" || !order) {
    return (
      <div className="checkout-confirmation">
        <h1>Commande introuvable</h1>
        <p>
          Nous n&apos;avons pas pu retrouver cette commande. Si vous avez été débité,
          contactez-nous et elle sera traitée normalement.
        </p>
        <a href="/compte/commandes" className="btn-primary">Voir mes commandes</a>
      </div>
    )
  }

  const currency: string = order.currency_code ?? "eur"

  return (
    <div className="checkout-confirmation">
      <p className="checkout-confirmation-badge">✓ Commande confirmée</p>
      <h1>Merci pour votre commande&nbsp;!</h1>
      <p>
        Votre commande <strong>#{order.display_id ?? order.id}</strong> a bien été enregistrée.
        Un email de confirmation vous a été envoyé à <strong>{order.email}</strong>.
      </p>

      <ul className="checkout-confirmation-items">
        {(order.items ?? []).map((item: any) => (
          <li key={item.id}>
            <span>{item.quantity} × {item.title}</span>
            <span>{formatPrice((item.unit_price ?? 0) * item.quantity, currency)}</span>
          </li>
        ))}
      </ul>

      <p className="checkout-confirmation-total">
        <span>Total TTC</span>
        <strong>{formatPrice(order.total ?? 0, currency)}</strong>
      </p>

      <div className="checkout-actions">
        <a href="/compte/commandes" className="btn-primary">Suivre ma commande</a>
        <a href="/produits" className="btn-text">Continuer mes achats</a>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p className="checkout-muted">Chargement…</p>}>
      <ConfirmationInner />
    </Suspense>
  )
}
