/**
 * Chargeur Stripe.js sans dépendance npm.
 *
 * Stripe impose de charger son script depuis https://js.stripe.com/v3 (jamais en
 * bundle). On l'injecte donc dynamiquement puis on instancie `Stripe(pk)`.
 *
 * Tant que NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY n'est pas renseignée, `getStripe()`
 * renvoie null et le checkout bascule sur le paiement manuel.
 */

const STRIPE_JS_URL = "https://js.stripe.com/v3"

// Types minimaux — on ne tire pas @stripe/stripe-js.
export type StripeLike = {
  elements: (options: Record<string, unknown>) => StripeElementsLike
  confirmPayment: (opts: {
    elements: StripeElementsLike
    clientSecret?: string
    confirmParams?: Record<string, unknown>
    redirect?: "always" | "if_required"
  }) => Promise<{ error?: { message?: string; type?: string } }>
  retrievePaymentIntent: (clientSecret: string) => Promise<{
    paymentIntent?: { status: string }
    error?: { message?: string }
  }>
}

export type StripeElementsLike = {
  create: (type: string, options?: Record<string, unknown>) => StripeElementLike
  getElement: (type: string) => StripeElementLike | null
  submit: () => Promise<{ error?: { message?: string } }>
}

export type StripeElementLike = {
  mount: (selector: string | HTMLElement) => void
  unmount: () => void
  destroy: () => void
  on: (event: string, handler: (ev: unknown) => void) => void
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string, options?: Record<string, unknown>) => StripeLike
  }
}

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || ""

export const isStripeConfigured = STRIPE_PUBLISHABLE_KEY.length > 0

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"))
  if (window.Stripe) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${STRIPE_JS_URL}"]`)
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Échec du chargement de Stripe.js")))
      if (window.Stripe) resolve()
      return
    }
    const script = document.createElement("script")
    script.src = STRIPE_JS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Échec du chargement de Stripe.js"))
    document.head.appendChild(script)
  })
  return scriptPromise
}

let stripeInstance: StripeLike | null = null

/** Instance Stripe partagée, ou null si la clé publiable n'est pas configurée. */
export async function getStripe(): Promise<StripeLike | null> {
  if (!isStripeConfigured) return null
  if (stripeInstance) return stripeInstance
  await loadScript()
  if (!window.Stripe) return null
  stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY)
  return stripeInstance
}
