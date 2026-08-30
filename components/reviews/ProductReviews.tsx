"use client"

import { useCallback, useEffect, useState } from "react"
import { sdk } from "@/lib/medusa"
import { useAuth } from "@/contexts/AuthContext"
import { StarRating } from "./StarRating"
import { ReviewForm } from "./ReviewForm"

type Review = {
  id: string
  rating: number
  title: string
  content: string
  customer_name: string
  is_verified: boolean
  created_at: string
}

type Stats = {
  average: number
  count: number
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>
}

type ApiResponse = {
  reviews: Review[]
  count: number
  stats: Stats
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso))
}

export function ProductReviews({ productId }: { productId: string }) {
  const { customer, isLoading } = useAuth()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await sdk.client.fetch<ApiResponse>(
        `/store/products/${productId}/reviews`,
        { query: { limit: 20 } }
      )
      setData(res)
    } catch {
      setData({ reviews: [], count: 0, stats: { average: 0, count: 0, breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } } })
    }
  }, [productId])

  useEffect(() => {
    load()
  }, [load])

  if (!data) {
    return (
      <section className="reviews" id="avis">
        <h2>Avis clients</h2>
        <p className="reviews__muted">Chargement…</p>
      </section>
    )
  }

  const { stats, reviews } = data

  return (
    <section className="reviews" id="avis">
      <div className="reviews__head">
        <h2>Avis clients</h2>
        {stats.count > 0 ? (
          <div className="reviews__score">
            <StarRating value={stats.average} />
            <strong>{stats.average.toFixed(1)}</strong>
            <span className="reviews__muted">
              · {stats.count} avis
            </span>
          </div>
        ) : (
          <p className="reviews__muted">Aucun avis pour le moment.</p>
        )}
      </div>

      {!isLoading && customer && !showForm && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowForm(true)}
        >
          Donner mon avis
        </button>
      )}
      {!isLoading && !customer && (
        <p className="reviews__muted">
          <a href="/connexion">Connectez-vous</a> pour laisser un avis (réservé aux
          clients ayant commandé ce produit).
        </p>
      )}

      {showForm && customer && (
        <ReviewForm
          productId={productId}
          onSubmitted={() => {
            setShowForm(false)
            load()
          }}
        />
      )}

      {reviews.length > 0 && (
        <ul className="reviews__list">
          {reviews.map((r) => (
            <li key={r.id} className="reviews__item">
              <div className="reviews__item-head">
                <StarRating value={r.rating} size={15} />
                <strong>{r.title}</strong>
              </div>
              <p className="reviews__meta">
                {r.customer_name} · {formatDate(r.created_at)}
                {r.is_verified && (
                  <span className="reviews__verified"> · Achat vérifié</span>
                )}
              </p>
              <p>{r.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
