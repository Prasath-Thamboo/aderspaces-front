"use client"

import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/cart"

export function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeItem, updateQuantity, isLoading } = useCart()

  if (!isOpen) return null

  const items = cart?.items ?? []
  const total = cart?.total ?? 0
  const currency = cart?.currency_code ?? "eur"

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <aside className="cart-drawer" aria-label="Votre panier">
        <div className="cart-drawer-header">
          <h2>Panier</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Fermer le panier" className="cart-close-btn">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Votre panier est vide.</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  {item.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail} alt={item.title} className="cart-item-img" />
                  )}
                  <div className="cart-item-info">
                    <p className="cart-item-title">{item.title}</p>
                    {item.variant?.title && (
                      <p className="cart-item-variant">{item.variant.title}</p>
                    )}
                    <p className="cart-item-price">
                      {formatPrice(item.unit_price * item.quantity, item.currency_code)}
                    </p>
                    <div className="cart-qty">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        aria-label="Diminuer la quantité"
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        aria-label="Augmenter la quantité"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="cart-remove"
                        aria-label="Supprimer"
                      >Retirer</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(total, currency)}</strong>
              </div>
              <a href="/panier" className="cart-view-btn">Voir le panier</a>
              <p className="cart-checkout-note">Paiement bientôt disponible</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
