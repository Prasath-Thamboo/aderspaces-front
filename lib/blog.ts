import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

/**
 * Blog éditorial en fichiers Markdown versionnés avec le code.
 * Les articles vivent dans `content/blog/*.md`, avec un front-matter :
 *
 *   ---
 *   title: "Aménager un open space"
 *   date: 2026-08-30
 *   excerpt: "Résumé court affiché dans la liste."
 *   cover: /images/blog/open-space.jpg   # optionnel
 *   author: "L'équipe Aderspace"          # optionnel
 *   ---
 *
 * Aucune base de données : lecture disque au build (SSG) / à la revalidation.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

export type BlogPostMeta = {
  slug: string
  title: string
  date: string // ISO (YYYY-MM-DD)
  excerpt: string
  cover: string | null
  author: string | null
  readingMinutes: number
}

export type BlogPost = BlogPostMeta & {
  content: string // corps Markdown brut
}

function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function parseFile(fileName: string): BlogPost | null {
  const slug = fileName.replace(/\.md$/, "")
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8")
  const { data, content } = matter(raw)

  if (!data.title || !data.date) {
    console.warn(`[blog] front-matter incomplet, article ignoré : ${fileName}`)
    return null
  }

  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date).slice(0, 10)

  return {
    slug,
    title: String(data.title),
    date,
    excerpt: String(data.excerpt ?? ""),
    cover: data.cover ? String(data.cover) : null,
    author: data.author ? String(data.author) : null,
    readingMinutes: readingMinutes(content),
    content,
  }
}

function listFiles(): string[] {
  try {
    return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  } catch {
    return []
  }
}

export function getAllPosts(): BlogPostMeta[] {
  return listFiles()
    .map(parseFile)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta)
}

export function getPostSlugs(): string[] {
  return listFiles().map((f) => f.replace(/\.md$/, ""))
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null
  const fileName = `${slug}.md`
  if (!listFiles().includes(fileName)) return null
  return parseFile(fileName)
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso))
}
