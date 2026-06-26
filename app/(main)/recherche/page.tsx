import type { Metadata } from "next"

export const metadata: Metadata = { title: "Recherche" }

type SearchHit = {
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  variants?: Array<{ prices?: Array<{ amount: number; currency_code: string }> }>
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

async function searchProducts(q: string): Promise<SearchHit[]> {
  if (!q.trim()) return []
  try {
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const res = await fetch(
      `${backendUrl}/store/search?q=${encodeURIComponent(q)}&limit=20`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.hits ?? []
  } catch {
    return []
  }
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function RecherchePage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const results = await searchProducts(q)

  return (
    <>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        {q ? `Résultats pour "${q}"` : "Recherche"}
      </h1>

      {q && (
        <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {results.length} résultat{results.length !== 1 ? "s" : ""}
        </p>
      )}

      {results.length > 0 ? (
        <div className="product-grid">
          {results.map((hit) => {
            const price = hit.variants?.[0]?.prices?.[0]
            return (
              <a key={hit.id} href={`/produits/${hit.handle}`} className="product-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                {hit.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hit.thumbnail}
                    alt={hit.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.75rem" }}
                  />
                )}
                <h3>{hit.title}</h3>
                {hit.description && (
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {hit.description}
                  </p>
                )}
                {price && (
                  <p className="price" style={{ marginTop: "0.5rem" }}>
                    {formatPrice(price.amount, price.currency_code)}
                  </p>
                )}
              </a>
            )
          })}
        </div>
      ) : q ? (
        <p style={{ color: "#666" }}>
          Aucun produit trouvé pour &quot;{q}&quot;. Essayez d&apos;autres termes ou{" "}
          <a href="/">parcourez notre catalogue</a>.
        </p>
      ) : (
        <p style={{ color: "#666" }}>Saisissez un terme dans la barre de recherche.</p>
      )}
    </>
  )
}
