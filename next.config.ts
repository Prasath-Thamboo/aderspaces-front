import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // MinIO local (dev)
      {
        protocol: "http",
        hostname: "localhost",
        port: "9002",
        pathname: "/maisonprint/**",
      },
      // MinIO ou S3-compatible (prod) — ajouter le domaine en production
      // { protocol: "https", hostname: "votre-domaine.com", pathname: "/**" },
    ],
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig
