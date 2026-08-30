import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getPostBySlug, getPostSlugs, getAllPosts, formatBlogDate } from "@/lib/blog"

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.date,
      images: post.cover ? [post.cover] : [],
    },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  return (
    <article className="blog-article">
      <nav aria-label="Fil d'Ariane" className="blog-article__crumbs">
        <a href="/">Accueil</a>
        <span aria-hidden="true">/</span>
        <a href="/blog">Journal</a>
      </nav>

      <header className="blog-article__head">
        <p className="blog-article__meta">
          {formatBlogDate(post.date)} · {post.readingMinutes} min de lecture
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="blog-article__lead">{post.excerpt}</p>}
      </header>

      {post.cover && (
        <div className="blog-article__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt="" />
        </div>
      )}

      <div className="blog-prose">
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </div>

      {related.length > 0 && (
        <aside className="blog-article__related">
          <h2>À lire ensuite</h2>
          <ul>
            {related.map((p) => (
              <li key={p.slug}>
                <a href={`/blog/${p.slug}`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  )
}
