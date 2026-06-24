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
    const { products } = await sdk.store.product.list({ handle })
    const product = products[0]
    if (!product) return {}

    return {
      title: product.title ?? undefined,
      description: product.description ?? undefined,
      openGraph: {
        images: product.thumbnail ? [product.thumbnail] : [],
      },
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

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const { products } = await sdk.store.product.list({
    handle,
    fields: "id,title,handle,description,thumbnail,images,options,variants.prices,variants.options,categories,metadata",
  })

  const product = products[0]
  if (!product) notFound()

  const category = product.categories?.[0]
  const firstPrice = product.variants?.[0]?.prices?.[0]

  return (
    <>
      <nav aria-label="Fil d'Ariane">
        <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", marginBottom: "1rem", fontSize: "0.875rem", color: "#666" }}>
          <li><a href="/">Accueil</a></li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li><a href={`/categories/${category.handle}`}>{category.name}</a></li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
        {/* Galerie */}
        <div>
          {product.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.title ?? ""}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          )}
        </div>

        {/* Infos produit */}
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{product.title}</h1>

          {firstPrice && (
            <p style={{ fontSize: "1.5rem", fontWeight: "700", margin: "1rem 0" }}>
              {formatPrice(firstPrice.amount, firstPrice.currency_code)}
              <span style={{ fontSize: "0.875rem", fontWeight: "400", color: "#666", marginLeft: "0.5rem" }}>
                TVA incluse
              </span>
            </p>
          )}

          {product.description && (
            <p style={{ color: "#444", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              {product.description}
            </p>
          )}

          {/* Variantes */}
          {product.options && product.options.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              {product.options.map((option) => (
                <div key={option.id} style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{option.title}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {option.values?.map((value) => (
                      <button
                        key={value.id}
                        style={{
                          padding: "0.4rem 1rem",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                          background: "#fff",
                          fontSize: "0.875rem",
                        }}
                        aria-label={`${option.title} : ${value.value}`}
                      >
                        {value.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bouton panier (Phase 2 — interactif) */}
          <button
            style={{
              width: "100%",
              padding: "0.9rem",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
            aria-label="Ajouter au panier"
          >
            Ajouter au panier
          </button>

          {/* Métadonnées produit (dimensions, compatibilité) */}
          {product.metadata && Object.keys(product.metadata).length > 0 && (
            <details style={{ marginTop: "2rem" }}>
              <summary style={{ cursor: "pointer", fontWeight: "600", marginBottom: "0.5rem" }}>
                Caractéristiques techniques
              </summary>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <tbody>
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "0.4rem 0", color: "#666", width: "40%" }}>{key}</td>
                      <td style={{ padding: "0.4rem 0" }}>{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      </div>
    </>
  )
}
