import { sdk } from "@/lib/medusa"

type Props = {
  handles: string[]
  title: string
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export async function CompatibleProducts({ handles, title }: Props) {
  if (!handles || handles.length === 0) return null

  let products: any[] = []
  try {
    const results = await Promise.all(
      handles.map((h) => sdk.store.product.list({ handle: h }))
    )
    products = results.flatMap((r) => r.products)
  } catch {
    return null
  }

  if (products.length === 0) return null

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", borderTop: "1px solid #e5e5e5", paddingTop: "1.5rem" }}>
        {title}
      </h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {products.map((product) => {
          const price = product.variants?.[0]?.prices?.[0]
          return (
            <a
              key={product.id}
              href={`/produits/${product.handle}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                transition: "box-shadow 0.2s",
                minWidth: "220px",
              }}
            >
              {product.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }}
                />
              )}
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.2rem" }}>{product.title}</p>
                {price && (
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>
                    {formatPrice(price.amount, price.currency_code)}
                  </p>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
