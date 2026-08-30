import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { CookieBanner } from "@/components/CookieBanner"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { MainWrapper } from "@/components/layout/MainWrapper"
import { SmoothScroll } from "@/components/motion/SmoothScroll"
import { Cursor } from "@/components/motion/Cursor"
import { BrandIntro } from "@/components/motion/BrandIntro"
import { PageTransition } from "@/components/motion/PageTransition"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  // axes optiques : contraste maximal en grand corps (voir --fraunces-*)
  axes: ["opsz", "SOFT", "WONK"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Aderspace — Mobilier de bureau",
    template: "%s | Aderspace",
  },
  description:
    "Mobilier de bureau design : bureaux, sièges et rangements de fabricants européens. Une sélection élégante pour votre espace de travail.",
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
            <SmoothScroll />
            <BrandIntro />
            <Cursor />
            <div className="grain" aria-hidden="true" />

            <SiteHeader />

            <CartDrawer />
            <PageTransition>
              <MainWrapper>{children}</MainWrapper>
            </PageTransition>

            <footer>
              <p>© {new Date().getFullYear()} Aderspace</p>
              <ul>
                <li><a href="/a-propos">À propos</a></li>
                <li><a href="/nos-fournisseurs">Nos fournisseurs</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/mentions-legales">Mentions légales</a></li>
                <li><a href="/cgv">CGV</a></li>
                <li><a href="/politique-confidentialite">Confidentialité</a></li>
                <li><a href="/cookies">Cookies</a></li>
                <li><a href="/mes-droits">Mes droits</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
              <ul className="footer-social">
                <li>
                  <a href="https://www.tiktok.com/@aderspace" target="_blank" rel="noopener noreferrer" aria-label="Aderspace sur TikTok">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/aderspace" target="_blank" rel="noopener noreferrer" aria-label="Aderspace sur Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.2c3.2 0 3.58.01 4.85.07c1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15a4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43c.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77a4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4c-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15a4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.73.07c-1.14.05-1.76.24-2.17.4c-.55.21-.94.47-1.35.88a3.6 3.6 0 0 0-.88 1.35c-.16.41-.35 1.03-.4 2.17c-.06 1.23-.07 1.59-.07 4.73s.01 3.5.07 4.73c.05 1.14.24 1.76.4 2.17c.21.55.47.94.88 1.35c.41.41.8.67 1.35.88c.41.16 1.03.35 2.17.4c1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c1.14-.05 1.76-.24 2.17-.4a3.65 3.65 0 0 0 1.35-.88c.41-.41.67-.8.88-1.35c.16-.41.35-1.03.4-2.17c.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.73c-.05-1.14-.24-1.76-.4-2.17a3.65 3.65 0 0 0-.88-1.35a3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4.01 15.14 4 12 4zm0 3.24a4.76 4.76 0 1 1 0 9.52a4.76 4.76 0 0 1 0-9.52zm0 1.8a2.96 2.96 0 1 0 0 5.92a2.96 2.96 0 0 0 0-5.92zm5.4-2a1.1 1.1 0 1 1 0 2.2a1.1 1.1 0 0 1 0-2.2z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/aderspace" target="_blank" rel="noopener noreferrer" aria-label="Aderspace sur Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.98H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89c1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.98A10 10 0 0 0 22 12z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@aderspace" target="_blank" rel="noopener noreferrer" aria-label="Aderspace sur YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19A31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.5v-7l6.5 3.5z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </footer>

            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
