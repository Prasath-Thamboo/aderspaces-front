"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { getStripe, type StripeElementsLike, type StripeLike } from "@/lib/stripe"

export type StripePaymentHandle = {
  /** Confirme le paiement Stripe. `returnUrl` sert au 3D Secure par redirection. */
  confirm: (returnUrl: string) => Promise<{ ok: boolean; error?: string }>
}

/**
 * Formulaire carte bancaire Stripe (Payment Element).
 * Monté uniquement quand une clé publiable Stripe est configurée et qu'une
 * session de paiement Stripe a fourni un `client_secret`.
 */
export const StripePaymentForm = forwardRef<StripePaymentHandle, { clientSecret: string }>(
  function StripePaymentForm({ clientSecret }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const stripeRef = useRef<StripeLike | null>(null)
    const elementsRef = useRef<StripeElementsLike | null>(null)
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

    useEffect(() => {
      let cancelled = false
      let mounted: { destroy: () => void } | null = null

      ;(async () => {
        try {
          const stripe = await getStripe()
          if (!stripe || cancelled) {
            setStatus("error")
            return
          }
          stripeRef.current = stripe
          const elements = stripe.elements({
            clientSecret,
            appearance: { theme: "flat", variables: { colorPrimary: "#C1502E" } },
          })
          elementsRef.current = elements
          const paymentEl = elements.create("payment", { layout: "tabs" })
          if (containerRef.current && !cancelled) {
            paymentEl.mount(containerRef.current)
            mounted = paymentEl
            setStatus("ready")
          }
        } catch {
          setStatus("error")
        }
      })()

      return () => {
        cancelled = true
        try { mounted?.destroy() } catch { /* noop */ }
      }
    }, [clientSecret])

    useImperativeHandle(ref, () => ({
      async confirm(returnUrl: string) {
        const stripe = stripeRef.current
        const elements = elementsRef.current
        if (!stripe || !elements) return { ok: false, error: "Le paiement n'est pas prêt." }
        const res = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: returnUrl },
          redirect: "if_required",
        })
        if (res.error) {
          return { ok: false, error: res.error.message || "Le paiement a été refusé." }
        }
        return { ok: true }
      },
    }), [clientSecret])

    return (
      <div className="checkout-stripe">
        <div ref={containerRef} />
        {status === "loading" && (
          <p className="checkout-muted">Chargement du formulaire de paiement sécurisé…</p>
        )}
        {status === "error" && (
          <p className="checkout-error">
            Impossible de charger Stripe. Vérifiez votre connexion, ou réessayez.
          </p>
        )}
      </div>
    )
  },
)
