import { sdk } from "@/lib/medusa"
import type { Metadata } from "next"
import { isHiddenProduct } from "@/lib/catalog-visibility"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tous les produits",
  description: "Mobilier de bureau design : bureaux, sièges et rangements — toute la collection Aderspace.",
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

async function listProducts() {
  try {
    const { products } = await sdk.store.product.list({
      limit: 100,
      fields: "id,title,handle,thumbnail,variants.prices,categories.handle",
    })
    return products.filter((p) => !isHiddenProduct(p))
  } catch (err) {
    // Backend injoignable (build sans API, coupure pendant une revalidation) :
    // on rend une page vide plutôt que de casser toute la route.
    console.error("[produits] échec du chargement des produits", err)
    return []
  }
}

export default async function ProduitsPage() {
  const products = await listProducts()

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
