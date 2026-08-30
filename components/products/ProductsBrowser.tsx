"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  applyCatalogFilters,
  deriveFacets,
  isSort,
  PRICE_STEP,
  SORTS,
  type BrowserProduct,
  type Sort,
} from "@/lib/catalog-filters"

export type { BrowserProduct }

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function ProductsBrowser({ products }: { products: BrowserProduct[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const facets = useMemo(() => deriveFacets(products), [products])
  const { categories, optionGroups, priceBounds } = facets

  // ─── Sélection courante lue dans l'URL ───
  const sort: Sort = isSort(searchParams.get("tri"))
    ? (searchParams.get("tri") as Sort)
    : "nouveautes"
  const activeCat = searchParams.get("cat") || ""
  const prixMax = ((): number | null => {
    const raw = Number(searchParams.get("prixMax"))
    return Number.isFinite(raw) && raw > 0 ? raw : null
  })()
  const selectedOptions = useMemo(
    () =>
      new Set(
        (searchParams.get("opt") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    [searchParams]
  )

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k)
        else next.set(k, v)
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const toggleOption = useCallback(
    (value: string) => {
      const next = new Set(selectedOptions)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      setParam({ opt: Array.from(next).join(",") || null })
    },
    [selectedOptions, setParam]
  )

  const resetAll = useCallback(
    () => router.replace(pathname, { scroll: false }),
    [pathname, router]
  )

  const hasActiveFilters =
    !!activeCat || prixMax != null || selectedOptions.size > 0 || sort !== "nouveautes"

  const sliderValue = prixMax ?? priceBounds?.max ?? 0

  const visible = useMemo(
    () =>
      applyCatalogFilters(
        products,
        { sort, category: activeCat, prixMax, options: selectedOptions },
        facets
      ),
    [products, sort, activeCat, prixMax, selectedOptions, facets]
  )

  return (
    <div className="catalog">
      <div className="catalog__toolbar">
        <div className="catalog__facets">
          {categories.length > 1 && (
            <details className="facet">
              <summary>Catégorie{activeCat ? " · 1" : ""}</summary>
              <div className="facet__panel">
                <label className="facet__opt">
                  <input
                    type="radio"
                    name="cat"
                    checked={!activeCat}
                    onChange={() => setParam({ cat: null })}
                  />
                  <span>Toutes</span>
                </label>
                {categories.map((c) => (
                  <label key={c.handle} className="facet__opt">
                    <input
                      type="radio"
                      name="cat"
                      checked={activeCat === c.handle}
                      onChange={() => setParam({ cat: c.handle })}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </details>
          )}

          {priceBounds && (
            <details className="facet">
              <summary>
                Prix
                {prixMax != null ? ` · ≤ ${formatPrice(sliderValue, "eur")}` : ""}
              </summary>
              <div className="facet__panel">
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={PRICE_STEP}
                  value={sliderValue}
                  aria-label="Prix maximum"
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setParam({
                      prixMax: v >= priceBounds.max ? null : String(v),
                    })
                  }}
                />
                <output className="facet__price">
                  Jusqu’à {formatPrice(sliderValue, "eur")}
                </output>
              </div>
            </details>
          )}

          {optionGroups.map((g) => {
            const count = g.values.filter((v) => selectedOptions.has(v)).length
            return (
              <details key={g.title} className="facet">
                <summary>
                  {g.title}
                  {count ? ` · ${count}` : ""}
                </summary>
                <div className="facet__panel">
                  {g.values.map((v) => (
                    <label key={v} className="facet__opt">
                      <input
                        type="checkbox"
                        checked={selectedOptions.has(v)}
                        onChange={() => toggleOption(v)}
                      />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
              </details>
            )
          })}

          {hasActiveFilters && (
            <button type="button" className="facet__reset" onClick={resetAll}>
              Réinitialiser
            </button>
          )}
        </div>

        <label className="catalog__sort">
          <span>Trier&nbsp;:</span>
          <select
            value={sort}
            onChange={(e) =>
              setParam({
                tri: e.target.value === "nouveautes" ? null : e.target.value,
              })
            }
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="catalog__count" aria-live="polite">
        {visible.length} produit{visible.length !== 1 ? "s" : ""}
      </p>

      {visible.length === 0 ? (
        <p className="catalog__empty">
          Aucun produit ne correspond à ces filtres.{" "}
          <button type="button" className="linklike" onClick={resetAll}>
            Tout afficher
          </button>
        </p>
      ) : (
        <div className="products-wall">
          {visible.map((product) => (
            <a
              key={product.id}
              href={`/produits/${product.handle}`}
              className="products-wall__card"
            >
              <div className="products-wall__media">
                {product.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.thumbnail} alt={product.title} />
                )}
              </div>
              <h2>{product.title}</h2>
              {product.priceAmount != null && (
                <p className="price">
                  {formatPrice(product.priceAmount, product.currency)}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
