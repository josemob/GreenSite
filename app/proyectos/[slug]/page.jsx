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
const stripTags = (s) => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

function twoTone(title) {
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

// separa la narrativa markdown por secciones (## El reto, ## La solución, ## El resultado)
function sections(html) {
  const out = {}
  const re = /<h2>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g
  let m
  while ((m = re.exec(html))) out[stripTags(m[1]).toLowerCase()] = m[2].trim()
  return out
}

const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>'

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) notFound()

  const cover = coverFor(p.cover, p.category, 0)
  const topResult = (p.results && p.results[0] && p.results[0].value) || '—'
  const initials = (p.client || p.title).split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  const sec = sections(p.html)
  const reto = sec['el reto'] || `<p>${esc(p.summary)}</p>`
  const solucion = sec['la solución'] || sec['la solucion'] || `<p>${esc(p.summary)}</p>`
  const resultadoTxt = stripTags(sec['el resultado'] || '') || p.summary

  // galería: portada + dos imágenes de marca
  const pool = ['/assets/svc-landing-2.jpg', '/assets/svc-tienda.jpg?v=2', '/assets/svc-corp.jpg?v=2', '/assets/svc-app-crop.jpg', '/assets/stats-title.jpg'].filter((x) => x !== cover)
  const g1 = cover, g2 = pool[0], g3 = pool[1]

  // botones "ver web / behance"
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

  // ---- rellenar el markup del diseño (se conserva TODO el formato) ----
  let body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/proyecto.html'), 'utf8')
  // botones antes del <main>
  const mainIdx = body.indexOf('<main')
  body = body.slice(0, mainIdx) + '{{ liveLinks }}' + body.slice(mainIdx)
  // hero
  body = body.replace(/(<h1 style="font-family:'Outfit',sans-serif;margin:0;font-size:clamp\(48px,8vw,128px\)[^>]*>)[\s\S]*?<\/h1>/, '$1{{ h1 }}</h1>')
  body = body.replace('background:#D4FF00;color:#0D0D0D">Landing Page</span>', 'background:#D4FF00;color:#0D0D0D">{{ cat }}</span>')
  body = body.replace(/(<p data-rv-words="" style="[^"]*">)[\s\S]*?<\/p>/, '$1{{ summary }}</p>')
  body = body.replace('<span style="font-size:18px;font-weight:500">Clínica estética, Caracas</span>', '<span style="font-size:18px;font-weight:500">{{ client }}</span>')
  body = body.replace('<span style="font-size:18px;font-weight:500">Landing Page</span>', '<span style="font-size:18px;font-weight:500">{{ cat }}</span>')
  body = body.replace('<span style="font-size:18px;font-weight:500">2026</span>', '<span style="font-size:18px;font-weight:500">{{ year }}</span>')
  body = body.replace('>Entrega</span><span style="font-size:18px;font-weight:500">2 semanas</span>', '>Resultado</span><span style="font-size:18px;font-weight:500">{{ topResult }}</span>')
  // portada + galería
  body = body.replace('<image-slot id="port-1" shape="rect" placeholder="Captura principal del proyecto"></image-slot>', '<image-slot shape="rect" src="{{ cover }}"></image-slot>')
  body = body.replace('<image-slot id="proj-g1" shape="rect" placeholder="Vista escritorio"></image-slot>', '<image-slot shape="rect" src="{{ g1 }}"></image-slot>')
  body = body.replace('<image-slot id="proj-g2" shape="rect" placeholder="Vista móvil"></image-slot>', '<image-slot shape="rect" src="{{ g2 }}"></image-slot>')
  body = body.replace('<image-slot id="proj-g3" shape="rect" placeholder="Detalle de UI"></image-slot>', '<image-slot shape="rect" src="{{ g3 }}"></image-slot>')
  // reto / solución (conserva los h2 a dos pesos del diseño)
  body = body.replace(/<p style="[^"]*">La clínica recibía[\s\S]*?<\/p>/, '<div class="gp-colprose">{{ reto }}</div>')
  body = body.replace(/<p style="[^"]*">Una landing enfocada[\s\S]*?<\/p>/, '<div class="gp-colprose">{{ solucion }}</div>')
  // testimonio / resultado
  body = body.replace(/(<div style="font-family:'Outfit',sans-serif;font-size:clamp\(28px,3\.4vw,52px\);font-weight:300;[^"]*">)[\s\S]*?(<\/div>\s*<div style="display:flex;align-items:center;gap:14px">)/, '$1“{{ resultado }}”$2')
  body = body.replace('font-weight:700">CM</span>', 'font-weight:700">{{ initials }}</span>')
  body = body.replace('<span style="font-size:16px;font-weight:600">Carla M.</span>', '<span style="font-size:16px;font-weight:600">{{ client }}</span>')
  body = body.replace('<span style="font-size:14px;color:rgba(243,242,242,.7)">Clínica estética, Caracas</span>', '<span style="font-size:14px;color:rgba(243,242,242,.7)">{{ clientRole }}</span>')
  // tarjetas relacionadas con imagen real
  body = body.replace('<image-slot id="{{ p.slot }}" shape="rect" placeholder="{{ p.ph }}"></image-slot>', '<image-slot shape="rect" src="{{ p.img }}"></image-slot>')

  const data = {
    h1: twoTone(p.title), cat: p.category, summary: p.summary, client: p.client, year: p.year,
    topResult, cover, coverAR: '16 / 9', g1, g2, g3, reto, solucion, resultado: resultadoTxt,
    initials, clientRole: p.client ? p.category : '', scope: p.services || [], more, liveLinks, waLink: WA
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
