import { sdk } from "@/lib/medusa"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import { CompatibleProducts } from "@/components/CompatibleProducts"
import { getCompatibleInks, getCompatiblePrinters } from "@/lib/compatibility"

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
  const categoryHandle = category?.handle ?? ""
  const firstPrice = (product.variants?.[0] as any)?.prices?.[0]

  const isInk = categoryHandle === "encre-cartouches"
  const isPrinter = categoryHandle === "imprimantes"

  const compatibleInkHandles = isPrinter ? getCompatibleInks(handle) : []
  const compatiblePrinterHandles = isInk ? getCompatiblePrinters(handle) : []

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

          <AddToCartButton
            variants={(product.variants ?? []) as any}
            options={(product.options ?? []) as any}
          />

          {/* Métadonnées produit */}
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
                      <td style={{ padding: "0.4rem 0" }}>
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      </div>

      {/* Compatibilité */}
      {isPrinter && compatibleInkHandles.length > 0 && (
        <CompatibleProducts handles={compatibleInkHandles} title="Consommables compatibles" />
      )}
      {isInk && compatiblePrinterHandles.length > 0 && (
        <CompatibleProducts handles={compatiblePrinterHandles} title="Compatible avec ces imprimantes" />
      )}
    </>
  )
}
