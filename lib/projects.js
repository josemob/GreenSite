import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const DIR = path.join(process.cwd(), 'content', 'projects')

function readSlugs() {
  if (!fs.existsSync(DIR)) return []
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

function meta(slug) {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), 'utf8')
  const { data } = matter(raw)
  return {
    slug,
    title: data.title ?? slug,
    client: data.client ?? '',
    category: data.category ?? '',
    year: data.year ? String(data.year) : '',
    order: typeof data.order === 'number' ? data.order : 99,
    url: data.url ?? '',
    behance: data.behance ?? '',
    summary: data.summary ?? '',
    services: data.services ?? [],
    results: data.results ?? []
  }
}

/** Todos los proyectos (metadatos), ordenados por `order`. */
export function getAllProjects() {
  return readSlugs()
    .map(meta)
    .sort((a, b) => a.order - b.order)
}

export function getProjectSlugs() {
  return readSlugs()
}

/** Un proyecto con su narrativa Markdown en HTML. */
export async function getProject(slug) {
  const full = path.join(DIR, `${slug}.md`)
  if (!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full, 'utf8')
  const { content } = matter(raw)
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  return { ...meta(slug), html: processed.toString() }
}
