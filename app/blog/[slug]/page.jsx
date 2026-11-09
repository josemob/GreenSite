import fs from 'node:fs'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { getPost, getPostSlugs, getAllPosts, fmtMonthYear } from '../../../lib/posts'
import { renderDesign, coverFor } from '../../../lib/dcEngine'
import GPSubpageClient from '../../../components/GPSubpageClient'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' }
  }
}

const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, vengo del blog y quiero una revisión de mi web.')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cat = (post.tags && post.tags[0]) || 'Artículo'
  const time = fmtMonthYear(post.date)
  const cover = coverFor(post.cover, cat, 0)

  // TOC + ids en los h2 del contenido
  let n = 0
  const toc = []
  const bodyHtml = post.html.replace(/<h2>([\s\S]*?)<\/h2>/g, (m, t) => {
    n++; const id = 'sec' + n; toc.push({ href: '#' + id, label: t.replace(/<[^>]+>/g, '') }); return `<h2 id="${id}">${t}</h2>`
  })

  // título del hero en dos pesos (700 / 300) con palabras data-rv
  const words = post.title.split(/\s+/)
  const cutN = Math.max(1, Math.ceil(words.length * 0.55))
  const w1 = words.slice(0, cutN).map((w) => `<span data-rv="">${esc(w)}</span>`).join('')
  const rest = words.slice(cutN)
  const w2 = rest.map((w, i) => i === rest.length - 1
    ? `<span data-rv="">${esc(w)}<span style="color:#D4FF00;-webkit-text-stroke:2px #0D0D0D;paint-order:stroke fill">.</span></span>`
    : `<span data-rv="">${esc(w)}</span>`).join('')
  const h1 = `<span style="display:flex;flex-wrap:wrap;column-gap:.22em;font-weight:700">${w1}</span>` +
    (rest.length ? `<span style="display:flex;flex-wrap:wrap;column-gap:.22em;font-weight:300">${w2}</span>` : '')

  // artículos relacionados (otros posts)
  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3).map((p, i) => {
    const c = (p.tags && p.tags[0]) || 'Artículo'
    return {
      href: `/blog/${p.slug}`, cat: c, img: coverFor(p.cover, c, i), time: fmtMonthYear(p.date),
      author: p.author || 'José Mobresú', title: p.title, excerpt: p.description,
      blur: '0px', scale: '1', veil: '0', revOp: '0', revBlur: '10px', revY: '14px', tW: '400'
    }
  })

  // ---- cirugía sobre el markup del diseño ----
  let body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/post.html'), 'utf8')
  // reemplazar el cuerpo del artículo (secciones de ejemplo) por la prosa real, conservando el CTA + tags/share
  const aOpen = body.indexOf('<article')
  const aTagEnd = body.indexOf('>', aOpen) + 1
  const ctaIdx = body.indexOf('<div style="display:flex;flex-direction:column;gap:20px;padding:clamp(28px,4vw,48px);border-radius:28px;background:#0D0D0D;color:#F3F2F2">')
  body = body.slice(0, aTagEnd) + '<div class="gp-prose">{{ bodyHtml }}</div>' + body.slice(ctaIdx)
  // hero: h1, categoría, fecha, descripción, portada
  body = body.replace(/(<h1 style="font-family:'Outfit',sans-serif;margin:0;font-size:clamp\(40px,6\.4vw,96px\)[^>]*>)[\s\S]*?<\/h1>/, '$1{{ h1 }}</h1>')
  body = body.replace('background:#D4FF00;color:#0D0D0D">Conversión</span>', 'background:#D4FF00;color:#0D0D0D">{{ cat }}</span>')
  body = body.replace('<span style="font-size:15px;color:#3A3836">Noviembre 2026</span>', '<span style="font-size:15px;color:#3A3836">{{ time }}</span>')
  body = body.replace(/(<p data-rv-words="" style="[^"]*">)[\s\S]*?<\/p>/, '$1{{ desc }}</p>')
  body = body.replace('<img src="assets/svc-corp.jpg?v=2" alt=""', '<img src="{{ cover }}" alt=""')
  body = body.replace(/\{\{\s*shareLabel\s*\}\}/g, 'Compartir')

  const data = { h1, cat, time, desc: post.description, cover, coverAR: '16 / 9', bodyHtml, toc, posts: related, waLink: WA }
  const { html, css } = renderDesign(body, data)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <GPSubpageClient />
    </>
  )
}
