"use client"

import { usePathname } from "next/navigation"
import { CartIcon } from "@/components/cart/CartIcon"
import { AccountLink } from "@/components/layout/AccountLink"
import { CatalogMenu } from "@/components/layout/CatalogMenu"

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className={isHome ? "header--overlay" : undefined}>
      <nav aria-label="Navigation principale">
        <a href="/" className="brand">Aderspace</a>
        <CatalogMenu />
      </nav>
      <div className="header-right">
        <form action="/recherche" method="GET" role="search" className="search-form">
          <input
            type="search"
            name="q"
            placeholder="Rechercher…"
            aria-label="Rechercher des produits"
            className="search-input"
          />
          <button type="submit" aria-label="Lancer la recherche" className="search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
        <a href="/recherche" aria-label="Rechercher" className="search-icon-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
        <AccountLink />
        <CartIcon />
      </div>
    </header>
  )
}
