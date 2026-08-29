import { sdk } from "@/lib/medusa"

/**
 * Catégories volontairement masquées côté client.
 * La logique back (seed, compatibilité, API devis) reste en place : on ne
 * fait que ne plus les exposer dans le storefront. Pour les réafficher,
 * il suffit de vider ce tableau.
 */
export const HIDDEN_CATEGORY_HANDLES = ["imprimantes", "encre-cartouches"] as const

export function isHiddenCategory(handle?: string | null): boolean {
  return !!handle && (HIDDEN_CATEGORY_HANDLES as readonly string[]).includes(handle)
}

type WithCategories = { categories?: Array<{ handle?: string | null } | null> | null }

export function isHiddenProduct(product: WithCategories): boolean {
  return (product.categories ?? []).some((c) => isHiddenCategory(c?.handle))
}

let cache: { handles: Set<string>; at: number } | null = null

/**
 * Ensemble des handles de produits appartenant à une catégorie masquée.
 * Utilisé là où l'API ne renvoie pas la catégorie (recherche).
 */
export async function getHiddenProductHandles(): Promise<Set<string>> {
  if (cache && Date.now() - cache.at < 60_000) return cache.handles
  try {
    const ids: string[] = []
    for (const handle of HIDDEN_CATEGORY_HANDLES) {
      const { product_categories } = await sdk.store.category.list({ handle, fields: "id" })
      for (const c of product_categories) ids.push(c.id)
    }
    if (ids.length === 0) {
      cache = { handles: new Set(), at: Date.now() }
      return cache.handles
    }
    const { products } = await sdk.store.product.list({
      category_id: ids,
      limit: 200,
      fields: "handle",
    })
    const handles = new Set(
      products.map((p) => p.handle).filter((h): h is string => !!h)
    )
    cache = { handles, at: Date.now() }
    return handles
  } catch {
    return new Set()
  }
}
