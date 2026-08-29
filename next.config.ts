import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

/**
 * Hôte de stockage des images produit (MinIO en local, R2/S3 en prod).
 * Dérivé de variables d'env → aucune URL en dur, prod = simple swap.
 */
const assetHost = process.env.NEXT_PUBLIC_ASSET_HOST
const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

function toRemotePattern(raw: string | undefined) {
  if (!raw) return null
  try {
    const u = new URL(raw)
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      port: u.port || undefined,
      pathname: "/**",
    }
  } catch {
    return null
  }
}

const remotePatterns = [toRemotePattern(assetHost), toRemotePattern(backendUrl)].filter(
  (p): p is NonNullable<typeof p> => p !== null
)

/**
 * Content-Security-Policy construite depuis l'environnement.
 * Envoyée uniquement en production : en `next dev`, le HMR et l'outillage
 * React Refresh ont besoin de sources (ws:, eval) qu'une CSP stricte bloque.
 */
function contentSecurityPolicy() {
  const connect = ["'self'", backendUrl, "https://api.stripe.com"].filter(Boolean).join(" ")
  const img = ["'self'", "data:", "blob:", assetHost, backendUrl].filter(Boolean).join(" ")
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    // Next.js injecte des scripts d'amorçage inline → 'unsafe-inline' requis sans nonce.
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src ${img}`,
    `connect-src ${connect}`,
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "upgrade-insecure-requests",
  ].join("; ")
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  ...(isProd
    ? [
        { key: "Content-Security-Policy", value: contentSecurityPolicy() },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ]
    : []),
]

const nextConfig: NextConfig = {
  // Sortie autonome pour l'image Docker de prod (cf. Dockerfile, qui pose
  // NEXT_OUTPUT_STANDALONE=1). Désactivée pour un `next build` local : le
  // tracing par symlinks échoue sous Windows sans Developer Mode.
  output: process.env.NEXT_OUTPUT_STANDALONE ? "standalone" : undefined,

  images: {
    remotePatterns,
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}

export default nextConfig
