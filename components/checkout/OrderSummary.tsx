"use client"

import { formatPrice } from "@/lib/cart"

type LineItem = {
  id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string | null
  variant?: { title?: string | null } | null
}

/** Récapitulatif du panier affiché en colonne latérale du checkout. */
export function OrderSummary({ cart }: { cart: any }) {
  if (!cart) return null
  const currency: string = cart.currency_code ?? "eur"
  const items: LineItem[] = cart.items ?? []
  const shippingTotal: number = cart.shipping_total ?? 0
  const taxTotal: number = cart.tax_total ?? 0
  const subtotal: number = cart.item_total ?? cart.subtotal ?? 0
  const total: number = cart.total ?? 0
  const hasShipping = (cart.shipping_methods?.length ?? 0) > 0

  return (
    <aside className="checkout-summary" aria-label="Récapitulatif de la commande">
      <h2>Votre commande</h2>

      <ul className="checkout-summary-items">
        {items.map((item) => (
          <li key={item.id}>
            <div className="checkout-summary-thumb">
              {item.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail} alt={item.title} />
              )}
              <span className="checkout-summary-qty">{item.quantity}</span>
            </div>
            <div className="checkout-summary-info">
              <p className="checkout-summary-title">{item.title}</p>
              {item.variant?.title && (
                <p className="checkout-summary-variant">{item.variant.title}</p>
              )}
            </div>
            <p className="checkout-summary-price">
              {formatPrice(item.unit_price * item.quantity, currency)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="checkout-summary-totals">
        <div>
          <dt>Sous-total</dt>
          <dd>{formatPrice(subtotal, currency)}</dd>
        </div>
        <div>
          <dt>Livraison</dt>
          <dd>{hasShipping ? formatPrice(shippingTotal, currency) : "À calculer"}</dd>
        </div>
        <div>
          <dt>Dont TVA</dt>
          <dd>{formatPrice(taxTotal, currency)}</dd>
        </div>
        <div className="checkout-summary-grand">
          <dt>Total TTC</dt>
          <dd>{formatPrice(total, currency)}</dd>
        </div>
      </dl>
    </aside>
  )
}
