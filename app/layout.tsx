import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { CookieBanner } from "@/components/CookieBanner"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { MainWrapper } from "@/components/layout/MainWrapper"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Aderspace — Mobilier, Tech & Impression",
    template: "%s | Aderspace",
  },
  description:
    "Mobilier de bureau, ordinateurs, imprimantes, encre et service de réparation. Une sélection élégante pour votre espace de travail.",
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
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <SiteHeader />

            <CartDrawer />
            <MainWrapper>{children}</MainWrapper>

            <footer>
              <p>© {new Date().getFullYear()} Aderspace</p>
              <ul>
                <li><a href="/a-propos">À propos</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/reparation">Réparation</a></li>
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
        </AuthProvider>
      </body>
    </html>
  )
}
