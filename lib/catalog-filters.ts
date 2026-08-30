/**
 * Logique pure de filtrage/tri du catalogue `/produits`.
 * Extraite du composant pour être testable unitairement.
 */

export type BrowserProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  priceAmount: number | null
  currency: string
  createdAt: string | null
  categories: { handle: string; name: string }[]
  optionGroups: { title: string; values: string[] }[]
}

export type Sort = "nouveautes" | "prix-asc" | "prix-desc" | "az" | "za"

export const SORTS: { value: Sort; label: string }[] = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "az", label: "Nom A–Z" },
  { value: "za", label: "Nom Z–A" },
]

export const PRICE_STEP = 1000 // 10 €

export const isSort = (v: unknown): v is Sort =>
  SORTS.some((s) => s.value === v)

const roundUp = (n: number, step: number) => Math.ceil(n / step) * step
const roundDown = (n: number, step: number) => Math.floor(n / step) * step

export type Facets = {
  categories: { handle: string; name: string }[]
  optionGroups: { title: string; values: string[] }[]
  priceBounds: { min: number; max: number } | null
}

export function deriveFacets(products: BrowserProduct[]): Facets {
  const catMap = new Map<string, string>()
  for (const p of products) for (const c of p.categories) catMap.set(c.handle, c.name)
  const categories = Array.from(catMap, ([handle, name]) => ({ handle, name })).sort(
    (a, b) => a.name.localeCompare(b.name, "fr")
  )

  const optMap = new Map<string, Set<string>>()
  for (const p of products)
    for (const g of p.optionGroups) {
      if (!optMap.has(g.title)) optMap.set(g.title, new Set())
      for (const v of g.values) optMap.get(g.title)!.add(v)
    }
  const optionGroups = Array.from(optMap, ([title, set]) => ({
    title,
    values: Array.from(set).sort((a, b) => a.localeCompare(b, "fr")),
  }))
    .filter((g) => g.values.length > 1)
    .sort((a, b) => a.title.localeCompare(b.title, "fr"))

  const prices = products
    .map((p) => p.priceAmount)
    .filter((v): v is number => v != null)
  let priceBounds: Facets["priceBounds"] = null
  if (prices.length > 0) {
    const min = roundDown(Math.min(...prices), PRICE_STEP)
    const max = roundUp(Math.max(...prices), PRICE_STEP)
    priceBounds = min === max ? null : { min, max }
  }

  return { categories, optionGroups, priceBounds }
}

export type FilterCriteria = {
  sort: Sort
  category: string // "" = toutes
  prixMax: number | null
  options: Set<string> // valeurs de variantes cochées
}

export function applyCatalogFilters(
  products: BrowserProduct[],
  criteria: FilterCriteria,
  facets: Facets = deriveFacets(products)
): BrowserProduct[] {
  let list = products.slice()

  if (criteria.category)
    list = list.filter((p) =>
      p.categories.some((c) => c.handle === criteria.category)
    )

  if (criteria.prixMax != null) {
    const max = criteria.prixMax
    list = list.filter((p) => p.priceAmount != null && p.priceAmount <= max)
  }

  if (criteria.options.size > 0) {
    // ET entre groupes de facettes, OU à l'intérieur d'un groupe.
    for (const group of facets.optionGroups) {
      const picked = group.values.filter((v) => criteria.options.has(v))
      if (picked.length === 0) continue
      list = list.filter((p) => {
        const pg = p.optionGroups.find((g) => g.title === group.title)
        return !!pg && pg.values.some((v) => picked.includes(v))
      })
    }
  }

  const byPrice = (dir: 1 | -1) => (a: BrowserProduct, b: BrowserProduct) => {
    if (a.priceAmount == null) return 1
    if (b.priceAmount == null) return -1
    return (a.priceAmount - b.priceAmount) * dir
  }
  switch (criteria.sort) {
    case "prix-asc":
      list.sort(byPrice(1))
      break
    case "prix-desc":
      list.sort(byPrice(-1))
      break
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title, "fr"))
      break
    case "za":
      list.sort((a, b) => b.title.localeCompare(a.title, "fr"))
      break
    default:
      list.sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0
        return tb - ta
      })
  }
  return list
}
