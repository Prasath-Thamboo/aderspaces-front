"use client"

import { useState } from "react"
import { sdk } from "@/lib/medusa"
import { StarRating } from "./StarRating"

type Props = {
  productId: string
  onSubmitted: () => void
}

type ApiError = { status?: number; message?: string }

export function ReviewForm({ productId, onSubmitted }: Props) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating < 1) {
      setError("Sélectionnez une note.")
      return
    }
    setState("sending")
    try {
      await sdk.client.fetch(`/store/products/${productId}/reviews`, {
        method: "POST",
        body: { rating, title, content },
      })
      setState("done")
      setError(null)
      onSubmitted()
    } catch (err) {
      const e2 = err as ApiError
      const byStatus: Record<number, string> = {
        401: "Votre session a expiré, reconnectez-vous.",
        403: "Seuls les clients ayant commandé ce produit peuvent laisser un avis.",
        409: "Vous avez déjà publié un avis sur ce produit.",
      }
      setError(
        (e2.status && byStatus[e2.status]) ||
          e2.message ||
          "Une erreur est survenue, réessayez."
      )
      setState("idle")
    }
  }

  if (state === "done") {
    return (
      <p className="review-form__done">
        Merci ! Votre avis sera publié après validation par notre équipe.
      </p>
    )
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3>Donner mon avis</h3>

      <div className="review-form__row">
        <label>Note</label>
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>

      <label className="review-form__row">
        <span>Titre</span>
        <input
          type="text"
          value={title}
          maxLength={120}
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Résumé en quelques mots"
        />
      </label>

      <label className="review-form__row">
        <span>Votre avis</span>
        <textarea
          value={content}
          rows={4}
          maxLength={4000}
          required
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ce qui vous a plu, les points d'attention…"
        />
      </label>

      {error && <p className="review-form__error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  )
}
