import fs from 'node:fs'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { getProject, getProjectSlugs, getAllProjects } from '../../../lib/projects'
import { renderDesign, coverFor } from '../../../lib/dcEngine'
import GPSubpageClient from '../../../components/GPSubpageClient'

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) return {}
  return {
    title: `${p.title} — ${p.category}`,
    description: p.summary,
    alternates: { canonical: `/proyectos/${slug}` },
    openGraph: { title: p.title, description: p.summary, type: 'article' }
  }
}

const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, vi un caso del portafolio y quiero algo así.')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function twoTone(title, size) {
  const words = title.split(/\s+/)
  const cut = Math.max(1, Math.min(words.length - 1, Math.ceil(words.length * 0.55)))
  const w1 = words.slice(0, cut).map((w) => `<span data-rv="">${esc(w)}</span>`).join('')
  const rest = words.slice(cut)
  const w2 = rest.map((w, i) => i === rest.length - 1
    ? `<span data-rv="">${esc(w)}<span style="color:#D4FF00;-webkit-text-stroke:2px #0D0D0D;paint-order:stroke fill">.</span></span>`
    : `<span data-rv="">${esc(w)}</span>`).join('')
  return `<span style="display:flex;flex-wrap:wrap;column-gap:.22em;font-weight:700">${w1}</span>` +
    (rest.length ? `<span style="display:flex;flex-wrap:wrap;column-gap:.22em;font-weight:300">${w2}</span>` : '')
}

const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>'

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) notFound()

  const cover = coverFor(p.cover, p.category, 0)
  const topResult = (p.results && p.results[0] && p.results[0].value) || '—'

  // botones "ver web en vivo" / Behance (si hay url real)
  const links = []
  if (p.url && !/example\.com/.test(p.url)) links.push(`<a href="${esc(p.url)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;background:#0D0D0D;color:#F3F2F2;padding:14px 22px;border-radius:999px;font-size:16px;font-weight:600;text-decoration:none">Ver web en vivo ${ARROW}</a>`)
  if (p.behance) links.push(`<a href="${esc(p.behance)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;border:1.5px solid #0D0D0D;color:#0D0D0D;padding:12.5px 22px;border-radius:999px;font-size:16px;font-weight:600;text-decoration:none">Ver en Behance ${ARROW}</a>`)
  const liveLinks = links.length
    ? `<div style="max-width:calc(1440px + 2 * clamp(20px,4vw,48px));box-sizing:border-box;margin:0 auto;padding:clamp(28px,3vw,40px) clamp(20px,4vw,48px) 0;display:flex;gap:12px;flex-wrap:wrap">${links.join('')}</div>`
    : ''

  const more = getAllProjects().filter((x) => x.slug !== slug).slice(0, 3).map((x, i) => ({
    href: `/proyectos/${x.slug}`, img: coverFor(x.cover, x.category, i), title: x.title,
    excerpt: x.summary, result: (x.results && x.results[0] && x.results[0].value) || '',
    tags: (x.services && x.services.length ? x.services.slice(0, 3) : [x.category]).filter(Boolean),
    scale: '1', clip: '0%', revOp: '0', revBlur: '10px', revY: '14px'
  }))

  // ---- cirugía sobre el markup del diseño ----
  let body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/proyecto.html'), 'utf8')
  // insertar botones antes del <main>
  const mainIdx = body.indexOf('<main')
  body = body.slice(0, mainIdx) + '{{ liveLinks }}' + body.slice(mainIdx)
  // quitar sección de gauges (datos falsos) + reto/solución/galería -> prosa real (conserva "Lo que hicimos")
  const seoStart = body.indexOf('<div data-seo=""')
  const svcAnchor = body.indexOf('<div style="display:flex;flex-wrap:wrap;gap:12px 64px;align-items:flex-start;padding-top:24px;border-top:2px solid #0D0D0D">')
  body = body.slice(0, seoStart) + '<div class="gp-prose">{{ bodyHtml }}</div>' + body.slice(svcAnchor)
  // quitar el testimonio de ejemplo (card oscura) que va tras los servicios
  const testiStart = body.indexOf('<div style="display:flex;flex-direction:column;gap:28px;padding:clamp(32px,5vw,72px);border-radius:28px;background:#0D0D0D;color:#F3F2F2">')
  const moreStart = body.indexOf('<div style="display:flex;flex-direction:column;gap:clamp(32px,4vw,48px)">')
  if (testiStart >= 0 && moreStart > testiStart) body = body.slice(0, testiStart) + body.slice(moreStart)
  // hero
  body = body.replace(/(<h1 style="font-family:'Outfit',sans-serif;margin:0;font-size:clamp\(48px,8vw,128px\)[^>]*>)[\s\S]*?<\/h1>/, '$1{{ h1 }}</h1>')
  body = body.replace('background:#D4FF00;color:#0D0D0D">Landing Page</span>', 'background:#D4FF00;color:#0D0D0D">{{ cat }}</span>')
  body = body.replace(/(<p data-rv-words="" style="[^"]*">)[\s\S]*?<\/p>/, '$1{{ summary }}</p>')
  body = body.replace('<span style="font-size:18px;font-weight:500">Clínica estética, Caracas</span>', '<span style="font-size:18px;font-weight:500">{{ client }}</span>')
  body = body.replace('<span style="font-size:18px;font-weight:500">Landing Page</span>', '<span style="font-size:18px;font-weight:500">{{ cat }}</span>')
  body = body.replace('<span style="font-size:18px;font-weight:500">2026</span>', '<span style="font-size:18px;font-weight:500">{{ year }}</span>')
  body = body.replace('>Entrega</span><span style="font-size:18px;font-weight:500">2 semanas</span>', '>Resultado</span><span style="font-size:18px;font-weight:500">{{ topResult }}</span>')
  // portada + tarjetas relacionadas con imagen real
  body = body.replace('<image-slot id="port-1" shape="rect" placeholder="Captura principal del proyecto"></image-slot>', '<image-slot shape="rect" src="{{ cover }}"></image-slot>')
  body = body.replace('<image-slot id="{{ p.slot }}" shape="rect" placeholder="{{ p.ph }}"></image-slot>', '<image-slot shape="rect" src="{{ p.img }}"></image-slot>')

  const data = {
    h1: twoTone(p.title), cat: p.category, summary: p.summary, client: p.client, year: p.year,
    topResult, cover, coverAR: '16 / 9', bodyHtml: p.html, scope: p.services || [], more,
    liveLinks, waLink: WA
  }
  const { html, css } = renderDesign(body, data)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <GPSubpageClient />
    </>
  )
}
