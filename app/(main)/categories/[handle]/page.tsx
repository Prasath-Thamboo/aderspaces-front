import { sdk } from "@/lib/medusa"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const revalidate = 60

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  try {
    const { product_categories } = await sdk.store.category.list({ handle })
    const category = product_categories[0]
    if (!category) return {}

    return {
      title: category.name,
      description: category.description ?? undefined,
    }
  } catch {
    return {}
  }
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export default async function CategoryPage({ params }: Props) {
  const { handle } = await params

  const { product_categories } = await sdk.store.category.list({ handle })
  const category = product_categories[0]

  if (!category) notFound()

  const { products } = await sdk.store.product.list({
    category_id: [category.id],
    limit: 24,
    fields: "id,title,handle,thumbnail,variants.prices",
  })

  return (
    <>
      <nav aria-label="Fil d'Ariane">
        <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
          <li><a href="/">Accueil</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{category.name}</li>
        </ol>
      </nav>

      <h1>{category.name}</h1>
      {category.description && <p style={{ color: "#666", marginTop: "0.5rem" }}>{category.description}</p>}

      {products.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>Aucun produit dans cette catégorie pour le moment.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const firstVariant = product.variants?.[0]
            const firstPrice = firstVariant?.prices?.[0]

            return (
              <a
                key={product.id}
                href={`/produits/${product.handle}`}
                className="product-card"
                style={{ display: "block" }}
              >
                {product.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.thumbnail}
                    alt={product.title ?? ""}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "4px", marginBottom: "0.75rem" }}
                  />
                )}
                <h2 style={{ fontSize: "1rem" }}>{product.title}</h2>
                {firstPrice && (
                  <p className="price">
                    {formatPrice(firstPrice.amount, firstPrice.currency_code)}
                  </p>
                )}
              </a>
            )
          })}
        </div>
      )}
    </>
  )
}
