import type { Metadata } from "next"
import "./globals.css"

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
        <header>
          <nav aria-label="Navigation principale">
            <a href="/">MaisonPrint</a>
            <ul>
              <li><a href="/categories/mobilier-moderne">Mobilier</a></li>
              <li><a href="/categories/imprimantes">Imprimantes</a></li>
              <li><a href="/categories/encre-cartouches">Encre & Cartouches</a></li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p>© {new Date().getFullYear()} MaisonPrint</p>
          <ul>
            <li><a href="/mentions-legales">Mentions légales</a></li>
            <li><a href="/cgv">CGV</a></li>
            <li><a href="/politique-confidentialite">Politique de confidentialité</a></li>
            <li><a href="/cookies">Cookies</a></li>
          </ul>
        </footer>
      </body>
    </html>
  )
}
