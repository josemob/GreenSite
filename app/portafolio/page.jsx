import fs from 'node:fs'
import path from 'node:path'
import { getAllProjects } from '../../lib/projects'
import { renderDesign, coverFor } from '../../lib/dcEngine'
import GPSubpageClient from '../../components/GPSubpageClient'

export const metadata = {
  title: 'Portafolio — Proyectos que ya están vendiendo',
  description:
    'Casos reales de webs, tiendas y apps diseñadas por Greenpop Studio. Diseño premium hecho para convertir, con resultados medibles.',
  alternates: { canonical: '/portafolio' }
}

const WA = 'https://wa.me/584128172712?text=' + encodeURIComponent('Hola Greenpop, vi el portafolio y quiero hablar de mi proyecto.')

export default function PortafolioPage() {
  let body = fs.readFileSync(path.join(process.cwd(), 'lib/dcPages/portafolio.html'), 'utf8')
  body = body
    .replace('<a href="Proyecto.dc.html"', '<a href="Proyecto.dc.html" data-cat="{{ p.cat }}"')
    .replace('<image-slot id="{{ p.slot }}" shape="rect" placeholder="{{ p.ph }}"></image-slot>', '<image-slot shape="rect" src="{{ p.img }}"></image-slot>')
    .replace('<button type="button" onClick="{{ c.pick }}"', '<button type="button" data-cat="{{ c.label }}" onClick="{{ c.pick }}"')

  const posts = getAllProjects().map((p, i) => ({
    href: `/proyectos/${p.slug}`,
    cat: p.category || 'Proyecto',
    img: coverFor(p.cover, p.category, i),
    title: p.title,
    excerpt: p.summary,
    result: (p.results && p.results[0] && p.results[0].value) || '',
    tags: (p.services && p.services.length ? p.services.slice(0, 3) : [p.category]).filter(Boolean),
    scale: '1', clip: '0%', revOp: '0', revBlur: '10px', revY: '14px'
  }))
  const uniqueCats = [...new Set(posts.map((p) => p.cat))]
  const cats = ['Todos', ...uniqueCats].map((label) => {
    const on = label === 'Todos'
    return { label, bg: on ? '#D4FF00' : 'transparent', bd: on ? '#D4FF00' : 'rgba(13,13,13,.25)', fw: on ? '600' : '400' }
  })

  const data = { posts, cats, empty: posts.length === 0, hasMore: false, waLink: WA }
  const { html, css } = renderDesign(body, data)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <GPSubpageClient />
    </>
  )
}
