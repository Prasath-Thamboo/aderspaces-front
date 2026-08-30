import type { Metadata } from "next"
import { getAllPosts, formatBlogDate } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils d'aménagement, guides d'entretien et repères d'achat pour votre mobilier de bureau.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="blog-index">
      <header className="blog-index__head">
        <h1>Le journal Aderspace</h1>
        <p>
          Conseils d&apos;aménagement, guides d&apos;entretien et repères d&apos;achat
          pour équiper vos espaces de travail.
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: "#3a362f" }}>Les premiers articles arrivent bientôt.</p>
      ) : (
        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-card">
              <a href={`/blog/${post.slug}`}>
                {post.cover && (
                  <div className="blog-card__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover} alt="" />
                  </div>
                )}
                <p className="blog-card__meta">
                  {formatBlogDate(post.date)} · {post.readingMinutes} min de lecture
                </p>
                <h2>{post.title}</h2>
                {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
                <span className="blog-card__more">Lire l&apos;article</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
