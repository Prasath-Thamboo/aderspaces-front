import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import { CartIcon } from "@/components/cart/CartIcon"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { CookieBanner } from "@/components/CookieBanner"

export const metadata: Metadata = {
  title: {
    default: "MaisonPrint — Mobilier, Imprimantes & Cartouches",
    template: "%s | MaisonPrint",
  },
  description:
    "Boutique en ligne de mobilier moderne, imprimantes et cartouches d'encre. Livraison en France.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <header>
            <nav aria-label="Navigation principale">
              <a href="/" style={{ fontWeight: 700, fontSize: "1.2rem", whiteSpace: "nowrap" }}>MaisonPrint</a>
              <ul>
                <li><a href="/categories/mobilier-moderne">Mobilier</a></li>
                <li><a href="/categories/imprimantes">Imprimantes</a></li>
                <li><a href="/categories/encre-cartouches">Encre & Cartouches</a></li>
              </ul>
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
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </form>
              <CartIcon />
            </div>
          </header>

          <CartDrawer />
          <main>{children}</main>

          <footer>
            <p>© {new Date().getFullYear()} MaisonPrint</p>
            <ul>
              <li><a href="/mentions-legales">Mentions légales</a></li>
              <li><a href="/cgv">CGV</a></li>
              <li><a href="/politique-confidentialite">Confidentialité</a></li>
              <li><a href="/cookies">Cookies</a></li>
              <li><a href="/mes-droits">Mes droits</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </footer>

          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  )
}
