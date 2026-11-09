import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function readSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

/** Lista de artículos (metadatos), ordenada por fecha desc. */
export function getAllPosts() {
  const posts = readSlugs().map((slug) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8')
    const { data } = matter(raw)
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ? String(data.date) : '',
      author: data.author ?? '',
      tags: data.tags ?? [],
      cover: data.cover ?? null
    }
  })
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostSlugs() {
  return readSlugs()
}

/** Un artículo con su contenido Markdown convertido a HTML. */
export async function getPost(slug) {
  const full = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ? String(data.date) : '',
    author: data.author ?? '',
    tags: data.tags ?? [],
    cover: data.cover ?? null,
    html: processed.toString()
  }
}

/** Formatea una fecha a "Mes Año" en español (p. ej. "Noviembre 2026"). */
export function fmtMonthYear(d) {
  if (!d) return ''
  try {
    const s = new Date(d).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    return s.charAt(0).toUpperCase() + s.slice(1)
  } catch {
    return d
  }
}

/** Formatea una fecha ISO a español legible. */
export function fmtDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return d
  }
}
