"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { sdk } from "@/lib/medusa"
import { getCartId, formatPrice } from "@/lib/cart"
import { isStripeConfigured } from "@/lib/stripe"
import {
  completeCheckout,
  initPaymentSession,
  listRegionPaymentProviders,
  listShippingOptions,
  retrieveCheckoutCart,
  selectShippingOption,
  setCartContact,
  STRIPE_PROVIDER_ID,
  SYSTEM_PROVIDER_ID,
  type CheckoutAddress,
  type ShippingOption,
} from "@/lib/checkout"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { StripePaymentForm, type StripePaymentHandle } from "@/components/checkout/StripePaymentForm"

type Step = "address" | "shipping" | "payment"

const EMPTY_ADDRESS: CheckoutAddress = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  postal_code: "",
  city: "",
  country_code: "fr",
  phone: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { customer, isLoading: authLoading } = useAuth()
  const { clearCart } = useCart()

  const [phase, setPhase] = useState<"loading" | "ready" | "empty">("loading")
  const [step, setStep] = useState<Step>("address")
  const [cart, setCart] = useState<any>(null)

  const [email, setEmail] = useState("")
  const [address, setAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS)

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("")

  const [useStripe, setUseStripe] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const stripeRef = useRef<StripePaymentHandle>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const cartId = getCartId()

  // ── Auth obligatoire pour commander ──
  useEffect(() => {
    if (!authLoading && !customer) {
      router.replace("/connexion?redirect=/checkout")
    }
  }, [authLoading, customer, router])

  // ── Chargement initial du panier + pré-remplissage ──
  useEffect(() => {
    if (authLoading || !customer) return
    let cancelled = false

    ;(async () => {
      const id = getCartId()
      if (!id) {
        if (!cancelled) setPhase("empty")
        return
      }
      try {
        // Rattache le panier anonyme au client connecté → visible dans /compte/commandes
        await sdk.store.cart.transferCart(id).catch(() => { /* déjà rattaché */ })

        const c = await retrieveCheckoutCart(id)
        if (cancelled) return
        if (!c || !c.items?.length) {
          setPhase("empty")
          return
        }
        setCart(c)
        setEmail(c.email ?? customer.email ?? "")

        // Pré-remplissage depuis la 1re adresse enregistrée du client
        const existing = c.shipping_address
        if (existing?.address_1) {
          setAddress({
            first_name: existing.first_name ?? "",
            last_name: existing.last_name ?? "",
            company: existing.company ?? "",
            address_1: existing.address_1 ?? "",
            address_2: existing.address_2 ?? "",
            postal_code: existing.postal_code ?? "",
            city: existing.city ?? "",
            country_code: existing.country_code ?? "fr",
            phone: existing.phone ?? "",
          })
        } else {
          try {
            const { addresses } = await sdk.store.customer.listAddress()
            const a: any = addresses?.[0]
            if (a && !cancelled) {
              setAddress({
                first_name: a.first_name ?? customer.first_name ?? "",
                last_name: a.last_name ?? customer.last_name ?? "",
                company: a.company ?? "",
                address_1: a.address_1 ?? "",
                address_2: a.address_2 ?? "",
                postal_code: a.postal_code ?? "",
                city: a.city ?? "",
                country_code: a.country_code ?? "fr",
                phone: a.phone ?? customer.phone ?? "",
              })
            } else if (!cancelled) {
              setAddress((prev) => ({
                ...prev,
                first_name: customer.first_name ?? "",
                last_name: customer.last_name ?? "",
                phone: customer.phone ?? "",
              }))
            }
          } catch {
            /* pas d'adresse enregistrée, on garde le formulaire vide */
          }
        }
        setPhase("ready")
      } catch {
        if (!cancelled) setPhase("empty")
      }
    })()

    return () => { cancelled = true }
  }, [authLoading, customer])

  const setField = (key: keyof CheckoutAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [key]: e.target.value }))

  // ── Étape 1 → 2 : adresses puis options de livraison ──
  const handleAddressSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cartId) return
    setSubmitting(true)
    setError("")
    try {
      const updated = await setCartContact(cartId, email.trim(), { ...address, country_code: "fr" })
      setCart(updated)
      const options = await listShippingOptions(cartId)
      setShippingOptions(options)
      if (options.length === 0) {
        setError(
          "Aucune option de livraison n'est configurée. Lancez le seed backend " +
          "(npm run seed) pour créer les modes de livraison.",
        )
        return
      }
      setSelectedOption((prev) => prev || options[0].id)
      setStep("shipping")
    } catch {
      setError("Impossible d'enregistrer l'adresse. Vérifiez les champs et réessayez.")
    } finally {
      setSubmitting(false)
    }
  }, [cartId, email, address])

  // ── Étape 2 → 3 : méthode de livraison puis session de paiement ──
  const handleShippingSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cartId || !selectedOption) return
    setSubmitting(true)
    setError("")
    try {
      await selectShippingOption(cartId, selectedOption)
      const fresh = await retrieveCheckoutCart(cartId)
      setCart(fresh)

      const regionId = fresh.region_id ?? fresh.region?.id
      const providers = regionId ? await listRegionPaymentProviders(regionId) : []
      if (providers.length === 0) {
        setError(
          "Aucun fournisseur de paiement n'est rattaché à la région. Lancez le seed " +
          "backend (npm run seed) pour le configurer.",
        )
        return
      }

      const stripeAvailable = providers.includes(STRIPE_PROVIDER_ID) && isStripeConfigured
      const providerId = stripeAvailable ? STRIPE_PROVIDER_ID : SYSTEM_PROVIDER_ID
      const session = await initPaymentSession(fresh, providerId)

      if (stripeAvailable) {
        const secret = session?.data?.client_secret
        if (!secret) {
          setError("La session de paiement Stripe n'a pas pu être initialisée.")
          return
        }
        setClientSecret(secret)
        setUseStripe(true)
      } else {
        setUseStripe(false)
      }
      setStep("payment")
    } catch {
      setError("Impossible de préparer le paiement. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }, [cartId, selectedOption])

  // ── Étape 3 : paiement + création de la commande ──
  const handlePay = useCallback(async () => {
    if (!cartId) return
    setSubmitting(true)
    setError("")
    try {
      if (useStripe) {
        const returnUrl = `${window.location.origin}/checkout/confirmation`
        const result = await stripeRef.current?.confirm(returnUrl)
        if (!result?.ok) {
          setError(result?.error ?? "Le paiement a échoué.")
          setSubmitting(false)
          return
        }
      }
      const res = await completeCheckout(cartId)
      if (res?.type === "order") {
        clearCart()
        router.replace(`/checkout/confirmation?order=${res.order.id}`)
      } else {
        setError(res?.error?.message ?? "La commande n'a pas pu être finalisée.")
        setSubmitting(false)
      }
    } catch {
      setError("Une erreur est survenue pendant le paiement. Aucun montant n'a été débité.")
      setSubmitting(false)
    }
  }, [cartId, useStripe, clearCart, router])

  if (authLoading || phase === "loading") {
    return <p className="checkout-muted">Chargement du tunnel de commande…</p>
  }

  if (phase === "empty") {
    return (
      <div className="checkout-empty">
        <h1>Commande</h1>
        <p>Votre panier est vide.</p>
        <a href="/produits" className="btn-primary">Découvrir les produits</a>
      </div>
    )
  }

  const selectedShipping = shippingOptions.find((o) => o.id === selectedOption)

  return (
    <div className="checkout">
      <div className="checkout-main">
        <h1>Commande</h1>

        <ol className="checkout-steps" aria-label="Étapes">
          <li aria-current={step === "address" ? "step" : undefined} data-done={step !== "address"}>
            1. Livraison
          </li>
          <li aria-current={step === "shipping" ? "step" : undefined} data-done={step === "payment"}>
            2. Mode d&apos;expédition
          </li>
          <li aria-current={step === "payment" ? "step" : undefined}>3. Paiement</li>
        </ol>

        {/* ── Étape 1 : coordonnées + adresse ── */}
        {step === "address" && (
          <form onSubmit={handleAddressSubmit} className="checkout-form">
            <h2>Coordonnées</h2>
            <div className="form-group">
              <label htmlFor="co-email">Email *</label>
              <input
                id="co-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <h2>Adresse de livraison</h2>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label htmlFor="co-first">Prénom *</label>
                <input id="co-first" required value={address.first_name} onChange={setField("first_name")} autoComplete="given-name" />
              </div>
              <div className="form-group">
                <label htmlFor="co-last">Nom *</label>
                <input id="co-last" required value={address.last_name} onChange={setField("last_name")} autoComplete="family-name" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="co-company">Société (optionnel)</label>
              <input id="co-company" value={address.company} onChange={setField("company")} autoComplete="organization" />
            </div>
            <div className="form-group">
              <label htmlFor="co-addr1">Adresse *</label>
              <input id="co-addr1" required value={address.address_1} onChange={setField("address_1")} autoComplete="address-line1" />
            </div>
            <div className="form-group">
              <label htmlFor="co-addr2">Complément d&apos;adresse</label>
              <input id="co-addr2" value={address.address_2} onChange={setField("address_2")} autoComplete="address-line2" />
            </div>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label htmlFor="co-postal">Code postal *</label>
                <input id="co-postal" required value={address.postal_code} onChange={setField("postal_code")} autoComplete="postal-code" inputMode="numeric" />
              </div>
              <div className="form-group">
                <label htmlFor="co-city">Ville *</label>
                <input id="co-city" required value={address.city} onChange={setField("city")} autoComplete="address-level2" />
              </div>
            </div>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label htmlFor="co-country">Pays</label>
                <input id="co-country" value="France" disabled />
              </div>
              <div className="form-group">
                <label htmlFor="co-phone">Téléphone</label>
                <input id="co-phone" type="tel" value={address.phone} onChange={setField("phone")} autoComplete="tel" />
              </div>
            </div>

            {error && <p className="checkout-error">{error}</p>}
            <button type="submit" className="btn-primary checkout-next" disabled={submitting}>
              {submitting ? "Validation…" : "Continuer vers l'expédition"}
            </button>
          </form>
        )}

        {/* ── Étape 2 : mode d'expédition ── */}
        {step === "shipping" && (
          <form onSubmit={handleShippingSubmit} className="checkout-form">
            <h2>Mode d&apos;expédition</h2>
            <ul className="checkout-options">
              {shippingOptions.map((opt) => (
                <li key={opt.id}>
                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="shipping-option"
                      value={opt.id}
                      checked={selectedOption === opt.id}
                      onChange={() => setSelectedOption(opt.id)}
                    />
                    <span className="checkout-option-name">{opt.name}</span>
                    <span className="checkout-option-price">
                      {opt.amount === 0 ? "Offert" : formatPrice(opt.amount, cart?.currency_code ?? "eur")}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {error && <p className="checkout-error">{error}</p>}
            <div className="checkout-actions">
              <button type="button" className="btn-text" onClick={() => { setError(""); setStep("address") }}>
                ← Retour
              </button>
              <button type="submit" className="btn-primary" disabled={submitting || !selectedOption}>
                {submitting ? "Préparation…" : "Continuer vers le paiement"}
              </button>
            </div>
          </form>
        )}

        {/* ── Étape 3 : paiement ── */}
        {step === "payment" && (
          <div className="checkout-form">
            <h2>Paiement</h2>

            {selectedShipping && (
              <p className="checkout-muted">
                Expédition : <strong>{selectedShipping.name}</strong>
                {" — "}
                {selectedShipping.amount === 0
                  ? "offerte"
                  : formatPrice(selectedShipping.amount, cart?.currency_code ?? "eur")}
              </p>
            )}

            {useStripe ? (
              <>
                <p className="checkout-muted">Paiement sécurisé par carte bancaire (Stripe, 3D Secure).</p>
                {clientSecret && <StripePaymentForm ref={stripeRef} clientSecret={clientSecret} />}
              </>
            ) : (
              <div className="checkout-manual-notice">
                <p>
                  <strong>Mode paiement manuel (test).</strong> Aucune clé Stripe n&apos;est
                  configurée : la commande sera créée sans débit réel.
                </p>
                <p className="checkout-muted">
                  Pour activer la carte bancaire, renseignez <code>STRIPE_SECRET_KEY</code>
                  {" "}(backend/.env) et <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
                  {" "}(frontend/.env), puis relancez le seed.
                </p>
              </div>
            )}

            {error && <p className="checkout-error">{error}</p>}
            <div className="checkout-actions">
              <button type="button" className="btn-text" onClick={() => { setError(""); setStep("shipping") }}>
                ← Retour
              </button>
              <button type="button" className="btn-primary" onClick={handlePay} disabled={submitting}>
                {submitting
                  ? "Traitement…"
                  : useStripe
                    ? `Payer ${formatPrice(cart?.total ?? 0, cart?.currency_code ?? "eur")}`
                    : "Valider la commande"}
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderSummary cart={cart} />
    </div>
  )
}
