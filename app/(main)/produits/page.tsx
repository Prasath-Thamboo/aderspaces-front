import { sdk } from "@/lib/medusa"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tous les produits",
  description: "Mobilier de bureau, ordinateurs, imprimantes et encre — toute la collection Aderspace.",
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export default async function ProduitsPage() {
  const { products } = await sdk.store.product.list({
    limit: 100,
    fields: "id,title,handle,thumbnail,variants.prices",
  })

  return (
    <>
      <h1>Tous les produits</h1>

      {products.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>Aucun produit pour le moment.</p>
      ) : (
        <div className="products-wall">
          {products.map((product) => {
            const firstVariant = product.variants?.[0]
            const firstPrice = (firstVariant as any)?.prices?.[0]

            return (
              <a key={product.id} href={`/produits/${product.handle}`} className="products-wall__card">
                <div className="products-wall__media">
                  {product.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.thumbnail} alt={product.title ?? ""} />
                  )}
                </div>
                <h2>{product.title}</h2>
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
