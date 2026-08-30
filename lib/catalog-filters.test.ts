import { describe, it, expect } from "vitest"
import {
  applyCatalogFilters,
  deriveFacets,
  isSort,
  type BrowserProduct,
  type FilterCriteria,
} from "./catalog-filters"

function p(over: Partial<BrowserProduct>): BrowserProduct {
  return {
    id: over.id ?? "p1",
    title: over.title ?? "Produit",
    handle: over.handle ?? "produit",
    thumbnail: null,
    priceAmount: "priceAmount" in over ? (over.priceAmount ?? null) : 10000,
    currency: "eur",
    createdAt: "createdAt" in over ? (over.createdAt ?? null) : "2026-01-01T00:00:00Z",
    categories: over.categories ?? [{ handle: "mobilier", name: "Mobilier" }],
    optionGroups: over.optionGroups ?? [],
  }
}

const base: FilterCriteria = {
  sort: "nouveautes",
  category: "",
  prixMax: null,
  options: new Set(),
}

const catalog: BrowserProduct[] = [
  p({ id: "a", title: "Bureau", priceAmount: 29900, createdAt: "2026-03-01T00:00:00Z", optionGroups: [{ title: "Coloris", values: ["Chêne", "Blanc"] }] }),
  p({ id: "b", title: "Fauteuil", priceAmount: 14900, createdAt: "2026-05-01T00:00:00Z", optionGroups: [{ title: "Coloris", values: ["Noir"] }] }),
  p({ id: "c", title: "Armoire", priceAmount: 49900, createdAt: "2026-01-15T00:00:00Z", categories: [{ handle: "rangement", name: "Rangement" }], optionGroups: [{ title: "Finition", values: ["Mat", "Brillant"] }] }),
  p({ id: "d", title: "Tabouret", priceAmount: null, createdAt: null }),
]

describe("deriveFacets", () => {
  it("collecte les catégories triées", () => {
    const { categories } = deriveFacets(catalog)
    expect(categories.map((c) => c.handle)).toEqual(["mobilier", "rangement"])
  })

  it("ne garde que les groupes d'options à plus d'une valeur", () => {
    const { optionGroups } = deriveFacets(catalog)
    const titles = optionGroups.map((g) => g.title)
    expect(titles).toContain("Coloris") // Chêne/Blanc/Noir
    expect(titles).toContain("Finition") // Mat/Brillant
  })

  it("calcule des bornes de prix arrondies au pas de 10 €", () => {
    const { priceBounds } = deriveFacets(catalog)
    expect(priceBounds).toEqual({ min: 14000, max: 50000 })
  })

  it("renvoie priceBounds null si tous les prix sont égaux", () => {
    const flat = [p({ id: "x", priceAmount: 20000 }), p({ id: "y", priceAmount: 20000 })]
    expect(deriveFacets(flat).priceBounds).toBeNull()
  })
})

describe("applyCatalogFilters", () => {
  it("sans critère, trie par nouveauté (createdAt desc, nulls en dernier)", () => {
    const out = applyCatalogFilters(catalog, base)
    expect(out.map((x) => x.id)).toEqual(["b", "a", "c", "d"])
  })

  it("filtre par catégorie", () => {
    const out = applyCatalogFilters(catalog, { ...base, category: "rangement" })
    expect(out.map((x) => x.id)).toEqual(["c"])
  })

  it("filtre par prix maximum et exclut les prix absents", () => {
    const out = applyCatalogFilters(catalog, { ...base, prixMax: 30000 })
    expect(out.map((x) => x.id).sort()).toEqual(["a", "b"])
  })

  it("trie par prix croissant, prix absent en dernier", () => {
    const out = applyCatalogFilters(catalog, { ...base, sort: "prix-asc" })
    expect(out.map((x) => x.id)).toEqual(["b", "a", "c", "d"])
  })

  it("trie par nom Z→A", () => {
    const out = applyCatalogFilters(catalog, { ...base, sort: "za" })
    expect(out.map((x) => x.title)).toEqual(["Tabouret", "Fauteuil", "Bureau", "Armoire"])
  })

  it("facette variante : OU dans un groupe", () => {
    const out = applyCatalogFilters(catalog, { ...base, options: new Set(["Chêne", "Noir"]) })
    expect(out.map((x) => x.id).sort()).toEqual(["a", "b"])
  })

  it("facette variante : ET entre groupes", () => {
    const out = applyCatalogFilters(catalog, { ...base, options: new Set(["Chêne", "Mat"]) })
    expect(out).toHaveLength(0)
  })
})

describe("isSort", () => {
  it("valide les valeurs connues", () => {
    expect(isSort("prix-asc")).toBe(true)
    expect(isSort("random")).toBe(false)
    expect(isSort(null)).toBe(false)
  })
})
