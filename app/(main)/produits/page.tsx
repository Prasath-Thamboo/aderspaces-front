import { Suspense } from "react"
import { sdk } from "@/lib/medusa"
import type { Metadata } from "next"
import { isHiddenProduct } from "@/lib/catalog-visibility"
import { ProductsBrowser, type BrowserProduct } from "@/components/products/ProductsBrowser"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tous les produits",
  description:
    "Mobilier de bureau design : bureaux, sièges et rangements — toute la collection Aderspace.",
}

function minEurPrice(variants: any[]): number | null {
  let best: number | null = null
  for (const v of variants ?? []) {
    for (const p of v?.prices ?? []) {
      if (p?.currency_code !== "eur" || typeof p.amount !== "number") continue
      if (best === null || p.amount < best) best = p.amount
    }
  }
  return best
}

async function listProducts(): Promise<BrowserProduct[]> {
  try {
    const { products } = await sdk.store.product.list({
      limit: 100,
      fields:
        "id,title,handle,thumbnail,created_at,categories.id,categories.name,categories.handle,options.title,options.values.value,variants.prices,variants.options.value",
    })

    return products
      .filter((p) => !isHiddenProduct(p as any))
      .map((p): BrowserProduct => {
        const optionGroups = ((p as any).options ?? [])
          .map((o: any) => ({
            title: String(o?.title ?? "").trim(),
            values: Array.from(
              new Set(
                (o?.values ?? [])
                  .map((val: any) => String(val?.value ?? "").trim())
                  .filter(Boolean)
              )
            ) as string[],
          }))
          .filter((o: { title: string; values: string[] }) => o.title && o.values.length > 0)

        return {
          id: p.id,
          title: p.title ?? "",
          handle: p.handle ?? "",
          thumbnail: p.thumbnail ?? null,
          priceAmount: minEurPrice((p as any).variants ?? []),
          currency: "eur",
          createdAt: (p as any).created_at ?? null,
          categories: ((p as any).categories ?? [])
            .filter((c: any) => c?.handle && c?.name)
            .map((c: any) => ({ handle: c.handle as string, name: c.name as string })),
          optionGroups,
        }
      })
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
        <Suspense
          fallback={
            <p className="catalog__count" style={{ marginTop: "1.5rem" }}>
              Chargement du catalogue…
            </p>
          }
        >
          <ProductsBrowser products={products} />
        </Suspense>
      )}
    </>
  )
}
