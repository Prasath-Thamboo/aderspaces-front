import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils, guides et actualités Aderspace.",
}

export default function BlogPage() {
  return (
    <article className="legal-page">
      <h1>Blog</h1>
      <p style={{ marginTop: "0.75rem", color: "#3a362f" }}>
        Nos premiers articles arrivent bientôt : conseils d&apos;aménagement, guides d&apos;entretien
        de votre mobilier et actualités Aderspace.
      </p>
    </article>
  )
}
