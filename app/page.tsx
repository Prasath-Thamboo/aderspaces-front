import { sdk } from "@/lib/medusa"

// ISR : revalide toutes les 60 secondes
export const revalidate = 60

const CATEGORIES = [
  { handle: "mobilier-moderne", label: "Mobilier Moderne", emoji: "🛋️" },
  { handle: "imprimantes", label: "Imprimantes", emoji: "🖨️" },
  { handle: "encre-cartouches", label: "Encre & Cartouches", emoji: "🖊️" },
]

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export default async function HomePage() {
  const { products } = await sdk.store.product.list({
    limit: 12,
    fields: "id,title,handle,thumbnail,variants.prices",
  })

  return (
    <>
      <section aria-label="Bienvenue">
        <h1>Bienvenue sur MaisonPrint</h1>
        <p>Mobilier design, imprimantes et consommables — tout pour votre intérieur et votre bureau.</p>
      </section>

      <section aria-label="Catégories">
        <h2>Nos univers</h2>
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none", margin: "1rem 0" }}>
          {CATEGORIES.map((cat) => (
            <li key={cat.handle}>
              <a
                href={`/categories/${cat.handle}`}
                style={{
                  display: "block",
                  padding: "1rem 1.5rem",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{cat.emoji}</div>
                <div>{cat.label}</div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Nouveautés">
        <h2>Nouveautés</h2>
        {products.length === 0 ? (
          <p>Aucun produit pour le moment. Lancez le seed pour afficher des produits.</p>
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
                  <h3>{product.title}</h3>
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
      </section>
    </>
  )
}
