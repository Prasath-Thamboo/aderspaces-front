import { getCompatibleProducts } from "@/lib/compatibility"

type Props = {
  productId: string
  title?: string
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export async function CompatibleProducts({
  productId,
  title = "Produits compatibles",
}: Props) {
  const products = await getCompatibleProducts(productId)
  if (products.length === 0) return null

  return (
    <section className="compat">
      <h2>{title}</h2>
      <div className="compat__list">
        {products.map((product) => {
          const price = product.variants?.[0]?.prices?.[0]
          return (
            <a
              key={product.id}
              href={`/produits/${product.handle}`}
              className="compat__card"
            >
              {product.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.thumbnail} alt="" />
              )}
              <div>
                <p className="compat__title">{product.title}</p>
                {price && (
                  <p className="compat__price">
                    {formatPrice(price.amount, price.currency_code)}
                  </p>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
