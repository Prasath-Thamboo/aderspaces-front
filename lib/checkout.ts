/**
 * Séquence de checkout Medusa v2, centralisée.
 *
 * Étapes : contact/adresses → méthode de livraison → session de paiement →
 * complétion du panier (création de la commande).
 */
import { sdk } from "@/lib/medusa"

export const STRIPE_PROVIDER_ID = "pp_stripe_stripe"
export const SYSTEM_PROVIDER_ID = "pp_system_default"

const CART_FIELDS =
  "*items,*items.variant,*items.product,*shipping_address,*billing_address," +
  "*shipping_methods,*payment_collection,*payment_collection.payment_sessions,*region"

export type CheckoutAddress = {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  postal_code: string
  city: string
  country_code: string
  phone?: string
}

export type ShippingOption = {
  id: string
  name: string
  amount: number
  price_type: string
}

export type PaymentSession = {
  id: string
  provider_id: string
  status: string
  data: Record<string, unknown> & { client_secret?: string }
}

/** Récupère le panier avec tous les champs nécessaires au tunnel. */
export async function retrieveCheckoutCart(cartId: string): Promise<any> {
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS })
  return cart
}

/** Enregistre l'email et les adresses sur le panier. */
export async function setCartContact(
  cartId: string,
  email: string,
  shipping: CheckoutAddress,
  billing?: CheckoutAddress,
): Promise<any> {
  const { cart } = await sdk.store.cart.update(cartId, {
    email,
    shipping_address: shipping,
    billing_address: billing ?? shipping,
  })
  return cart
}

/** Liste les options de livraison applicables au panier. */
export async function listShippingOptions(cartId: string): Promise<ShippingOption[]> {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
  return (shipping_options ?? []).map((o: any) => ({
    id: o.id,
    name: o.name,
    amount: o.amount ?? o.calculated_price?.calculated_amount ?? 0,
    price_type: o.price_type,
  }))
}

/** Ajoute la méthode de livraison choisie au panier. */
export async function selectShippingOption(cartId: string, optionId: string): Promise<any> {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, { option_id: optionId })
  return cart
}

/** Fournisseurs de paiement disponibles pour la région. */
export async function listRegionPaymentProviders(regionId: string): Promise<string[]> {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({ region_id: regionId })
  return (payment_providers ?? []).map((p: any) => p.id)
}

/**
 * Crée (ou réutilise) la session de paiement pour le provider choisi et renvoie
 * la session correspondante — dont `data.client_secret` pour Stripe.
 */
export async function initPaymentSession(cart: any, providerId: string): Promise<PaymentSession | undefined> {
  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
  })
  const sessions: PaymentSession[] = payment_collection?.payment_sessions ?? []
  return sessions.find((s) => s.provider_id === providerId) ?? sessions[0]
}

/**
 * Finalise le panier → commande. Renvoie `{ type: "order", order }` en cas de
 * succès, `{ type: "cart", error }` sinon.
 */
export async function completeCheckout(cartId: string): Promise<any> {
  return sdk.store.cart.complete(cartId)
}
