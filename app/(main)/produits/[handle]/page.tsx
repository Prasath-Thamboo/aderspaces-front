import { sdk } from "@/lib/medusa"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import { CompatibleProducts } from "@/components/CompatibleProducts"
import { ProductReviews } from "@/components/reviews/ProductReviews"
import { isHiddenProduct } from "@/lib/catalog-visibility"

export const revalidate = 60

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  try {
    const { products } = await sdk.store.product.list({
      handle,
      fields: "id,title,description,thumbnail,categories.handle",
    })
    const product = products[0]
    if (!product || isHiddenProduct(product)) return {}
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

async function loadProduct(handle: string) {
  try {
    const { products } = await sdk.store.product.list({
      handle,
      fields:
        "id,title,handle,description,thumbnail,*images,options,variants.prices,variants.options,categories,metadata",
    })
    return products[0] ?? null
  } catch (err) {
    console.error("[produit] échec du chargement", handle, err)
    return null
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const product = await loadProduct(handle)
  if (!product || isHiddenProduct(product)) notFound()

  const category = product.categories?.[0]
  const firstPrice = (product.variants?.[0] as any)?.prices?.[0]

  // Galerie : les médias du produit, vignette en tête ; repli sur le seul thumbnail.
  const galleryUrls: string[] = (() => {
    const urls = ((product.images ?? []) as { url?: string }[])
      .map((img) => img?.url)
      .filter((u): u is string => Boolean(u))
    if (product.thumbnail) {
      return [product.thumbnail, ...urls.filter((u) => u !== product.thumbnail)]
    }
    return urls
  })()

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

      <div className="product-detail">
        {/* Galerie */}
        <div className="product-detail__gallery">
          {galleryUrls[0] && (
            <div className="product-gallery__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={galleryUrls[0]} alt={product.title ?? ""} />
            </div>
          )}
          {galleryUrls.length > 1 && (
            <div className="product-gallery__thumbs">
              {galleryUrls.slice(1).map((url, i) => (
                <div key={url} className="product-gallery__thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${product.title ?? "Produit"} — vue ${i + 2}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos produit */}
        <div className="product-detail__info">
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

      <CompatibleProducts productId={product.id} />
      <ProductReviews productId={product.id} />
    </>
  )
}
